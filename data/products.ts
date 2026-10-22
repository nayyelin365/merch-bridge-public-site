/**
 * Product categories shown in the navigation and on product pages.
 *
 * To add a category:
 *   1. Create a folder in public/images/<direction>/<slug>/ and add images
 *      (optional cover.png, optional brand/ folder, optional sub-folders for groups).
 *   2. Add an entry below with the same `slug`.
 *   3. Run `npm run dev` or `npm run build` — the image list is generated automatically.
 *
 * Product names come from the image file names (see lib/product-name.ts).
 */
import { categoryImages } from "@/data/image-manifest.generated";
import { labelFromFolder, productNameFromFile, sortKeyFromFile } from "@/lib/product-name";
import type { CategoryImages, ImageAsset, Product } from "@/lib/types";

export type ProductCategory = {
  slug: string;
  name: string;
  summary: string;
  /** Optional brand name shown on the category page. */
  brand?: string;
  /** Optional display labels for sub-folders, e.g. { nuts: "Nuts & Seeds" }. */
  groupLabels?: Record<string, string>;
  /**
   * How product images sit in their cards. "contain" (default) shows the whole image —
   * best for images with text or white backgrounds. "cover" fills the card — best for photos.
   */
  imageFit?: "cover" | "contain";
  /** Card image proportions as a CSS aspect-ratio, default "1 / 1". */
  imageAspect?: string;
};

export type ProductDirection = {
  slug: "export" | "import";
  name: string;
  summary: string;
  categories: ProductCategory[];
};

export const productDirections: ProductDirection[] = [
  {
    slug: "export",
    name: "Export",
    summary: "Agricultural, aquatic and artisan products sourced for international buyers.",
    categories: [
      {
        slug: "agri-products",
        name: "Agri-Products",
        summary: "Rice, beans and pulses, corn, chilies, nuts and onions.",
        imageFit: "cover",
      },
      {
        slug: "aqua-products",
        name: "Aqua Products",
        summary: "Freshwater and seawater fish and seafood.",
        imageAspect: "4 / 3",
      },
      {
        slug: "handicraft-artisan",
        name: "Handicraft & Artisan",
        summary: "Lacquerware, gemstones, jade, mother-of-pearl and handwoven homeware.",
        imageAspect: "6 / 5",
      },
    ],
  },
  {
    slug: "import",
    name: "Import",
    summary: "Quality consumer products brought in for the local market.",
    categories: [
      {
        slug: "pet-care",
        name: "Pet Care Products",
        brand: "Green Doge",
        summary: "Herbal shampoos, sprays and grooming products for dogs and cats.",
        imageAspect: "4 / 5",
      },
    ],
  },
];

export type ProductGroup = { label: string | null; products: Product[] };

const EMPTY: CategoryImages = { cover: null, brand: [], items: [], groups: [] };

function toProducts(images: ImageAsset[]): Product[] {
  return [...images]
    .sort((a, b) => sortKeyFromFile(a.file) - sortKeyFromFile(b.file) || a.file.localeCompare(b.file))
    .map((image) => ({ name: productNameFromFile(image.file), image }));
}

export function getDirection(slug: string): ProductDirection | undefined {
  return productDirections.find((d) => d.slug === slug);
}

export function getCategory(directionSlug: string, categorySlug: string) {
  const direction = getDirection(directionSlug);
  const category = direction?.categories.find((c) => c.slug === categorySlug);
  return direction && category ? { direction, category } : undefined;
}

export function getCategoryImages(directionSlug: string, categorySlug: string): CategoryImages {
  return categoryImages[`${directionSlug}/${categorySlug}`] ?? EMPTY;
}

/** Products for a category, split into groups when the folder has sub-folders. */
export function getProductGroups(directionSlug: string, categorySlug: string): ProductGroup[] {
  const images = getCategoryImages(directionSlug, categorySlug);
  const labels = getCategory(directionSlug, categorySlug)?.category.groupLabels ?? {};
  const groups: ProductGroup[] = [];

  if (images.items.length) groups.push({ label: null, products: toProducts(images.items) });
  for (const group of images.groups) {
    groups.push({
      label: labels[group.folder] ?? labelFromFolder(group.folder),
      products: toProducts(group.items),
    });
  }
  return groups;
}

export function countProducts(directionSlug: string, categorySlug: string): number {
  const images = getCategoryImages(directionSlug, categorySlug);
  return images.items.length + images.groups.reduce((n, g) => n + g.items.length, 0);
}

/** Image for a category card: the cover image, else the first product, else the brand logo. */
export function getCategoryPreview(directionSlug: string, categorySlug: string): ImageAsset | null {
  const images = getCategoryImages(directionSlug, categorySlug);
  return images.cover ?? images.items[0] ?? images.groups[0]?.items[0] ?? images.brand[0] ?? null;
}

export function categoryHref(directionSlug: string, categorySlug: string) {
  return `/products/${directionSlug}/${categorySlug}`;
}
