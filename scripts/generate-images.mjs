#!/usr/bin/env node
/**
 * Scans product images in public/images and:
 *   1. writes resized WebP copies to public/optimized/ (thumbnail + large),
 *   2. writes data/image-manifest.generated.ts listing every image.
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * Unchanged images are skipped, so re-runs are fast.
 *
 * Folder conventions (per category, e.g. public/images/export/agri-products/):
 *   cover.(png|jpg)   -> category cover image (optional)
 *   brand/*           -> brand logos shown on the category page (optional)
 *   <sub-folder>/*    -> a product group (e.g. "beans"), shown as its own section
 *   *.png / *.jpg     -> products; the file name becomes the product name
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUT_DIR = path.join(ROOT, "public", "optimized");
const MANIFEST = path.join(ROOT, "data", "image-manifest.generated.ts");

const DIRECTIONS = ["export", "import"];
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".jfif", ".webp", ".avif"]);

const SIZES = {
  thumb: { width: 640, quality: 78 },
  full: { width: 1600, quality: 82 },
};

const SITE_IMAGES = {
  logo: { file: "merch_bridge_logo.jpeg", thumb: { width: 200, quality: 85 }, full: { width: 640, quality: 85 } },
  hero: { file: "home/hero.png", thumb: { width: 960, quality: 72 }, full: { width: 1920, quality: 75 } },
};

const isImage = (name) => IMAGE_EXT.has(path.extname(name).toLowerCase()) && !name.startsWith(".");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function isFresh(source, target) {
  try {
    const [s, t] = await Promise.all([stat(source), stat(target)]);
    return t.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

let processed = 0;
let skipped = 0;

async function resize(source, target, { width, quality }, meta) {
  const outWidth = Math.min(width, meta.width);
  const outHeight = Math.round((meta.height * outWidth) / meta.width);
  if (await isFresh(source, target)) {
    skipped++;
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await sharp(source).rotate().resize({ width: outWidth }).webp({ quality }).toFile(target);
    processed++;
  }
  return { width: outWidth, height: outHeight };
}

/** Builds both sizes for one image and returns its manifest entry. */
async function buildAsset(relPath, sizes = SIZES) {
  const source = path.join(IMAGES_DIR, relPath);
  const meta = await sharp(source).rotate().metadata();
  // Metadata width/height ignore EXIF rotation; swap when the image is rotated 90°.
  const rotated = (meta.orientation ?? 1) >= 5;
  const dims = rotated ? { width: meta.height, height: meta.width } : { width: meta.width, height: meta.height };

  const dir = path.dirname(relPath);
  const base = slugify(path.basename(relPath, path.extname(relPath)));
  const thumbRel = path.posix.join(dir.split(path.sep).join("/"), `${base}-${sizes.thumb.width}.webp`);
  const fullRel = path.posix.join(dir.split(path.sep).join("/"), `${base}-${sizes.full.width}.webp`);

  const thumb = await resize(source, path.join(OUT_DIR, thumbRel), sizes.thumb, dims);
  const full = await resize(source, path.join(OUT_DIR, fullRel), sizes.full, dims);

  return {
    file: path.basename(relPath),
    src: `/optimized/${thumbRel}`,
    width: thumb.width,
    height: thumb.height,
    full: `/optimized/${fullRel}`,
    fullWidth: full.width,
    fullHeight: full.height,
  };
}

async function listDir(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function buildImageList(relDir) {
  const entries = await listDir(path.join(IMAGES_DIR, relDir));
  const files = entries.filter((e) => e.isFile() && isImage(e.name)).map((e) => e.name).sort();
  return Promise.all(files.map((f) => buildAsset(path.join(relDir, f))));
}

async function buildCategory(relDir) {
  const entries = await listDir(path.join(IMAGES_DIR, relDir));
  const category = { cover: null, brand: [], items: [], groups: [] };

  for (const entry of entries) {
    const rel = path.join(relDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "brand") {
        category.brand = await buildImageList(rel);
      } else {
        const items = await buildImageList(rel);
        if (items.length) category.groups.push({ folder: entry.name, items });
      }
    } else if (entry.isFile() && isImage(entry.name)) {
      if (path.parse(entry.name).name.toLowerCase() === "cover") {
        category.cover = await buildAsset(rel);
      } else {
        category.items.push(await buildAsset(rel));
      }
    }
  }
  category.groups.sort((a, b) => a.folder.localeCompare(b.folder));
  return category;
}

async function main() {
  const started = Date.now();
  const categories = {};

  for (const direction of DIRECTIONS) {
    const entries = await listDir(path.join(IMAGES_DIR, direction));
    for (const entry of entries.filter((e) => e.isDirectory())) {
      categories[`${direction}/${entry.name}`] = await buildCategory(path.join(direction, entry.name));
    }
  }

  const site = {};
  for (const [key, { file, thumb, full }] of Object.entries(SITE_IMAGES)) {
    site[key] = await buildAsset(file, { thumb, full });
  }

  const sortedCategories = Object.fromEntries(Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)));
  const source = `// AUTO-GENERATED by scripts/generate-images.mjs — do not edit by hand.
// Add or remove images in public/images/, then run \`npm run images\` (also runs on dev/build).
import type { CategoryImages, ImageAsset } from "@/lib/types";

export const siteImages: Record<${Object.keys(site).map((k) => JSON.stringify(k)).join(" | ")}, ImageAsset> = ${JSON.stringify(site, null, 2)};

export const categoryImages: Record<string, CategoryImages> = ${JSON.stringify(sortedCategories, null, 2)};
`;
  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, source);

  const count = Object.values(categories).reduce(
    (n, c) => n + c.items.length + c.groups.reduce((g, x) => g + x.items.length, 0),
    0,
  );
  console.log(
    `images: ${count} products in ${Object.keys(categories).length} categories ` +
      `(${processed} files written, ${skipped} up to date) in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
