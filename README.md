# Merch Bridge Company Limited — Website

Static corporate website built with Next.js (App Router), TypeScript and CSS Modules.
`npm run build` exports a fully static site to `out/`, which can be uploaded to any static host.

## Commands

| Command          | What it does                                                          |
| ---------------- | --------------------------------------------------------------------- |
| `npm run dev`    | Local dev server at http://localhost:3000 (optimizes images first)    |
| `npm run build`  | Optimizes images, then builds the static site into `out/`             |
| `npm start`      | Serves the built `out/` folder locally for a final check              |
| `npm run images` | Re-scans `public/images/` and regenerates optimized images + manifest |

Optional: set `NEXT_PUBLIC_SITE_URL=https://your-domain` when building so social-share previews use absolute URLs.

## Project layout

```
app/                         pages (home, /products, /products/[direction]/[category])
components/                  Navbar, ProductDropdown, HeroSection, ProductCategoryGrid,
                             ProductCard, ImageLightbox, ServicesSection, ContactSection, Footer…
data/company.ts              company name, slogan, contact details
data/products.ts             Export / Import categories (names, summaries, display options)
data/image-manifest.generated.ts   AUTO-GENERATED list of images — do not edit
lib/product-name.ts          turns image file names into product names
scripts/generate-images.mjs  image optimizer + manifest generator
public/images/               original images (source of truth)
public/optimized/            generated WebP images (git-ignored)
```

## Adding or changing products

Product images live in `public/images/<export|import>/<category>/`:

```
public/images/export/agri-products/
├── cover.png          ← category card image (optional)
├── beans/             ← sub-folder = a product group with its own heading
│   ├── 1. Black Gram (Black Matpe).jpg
│   └── 2. Green Gram (Mung Bean).jpg
└── …
public/images/import/pet-care/
├── brand/             ← brand logo shown on the category page (optional)
└── 1. Dry Foam for Cat.png
```

- **Product name = file name.** `1. Black Gram (Black Matpe).jpg` is shown as "Black Gram (Black Matpe)".
  The leading number only sets the order. Slug names like `red-kidney-bean.jpg` become "Red Kidney Bean".
  To fix a name, rename the file.
- **Add a product:** drop the image into the folder and run `npm run dev` or `npm run build`.
- **Add a category:** create the folder, then add an entry with the same `slug` to `data/products.ts`.
  Categories without images show a "coming soon" message.
- **Contact details:** fill in `data/company.ts`. Empty fields show "To be confirmed"; email and phone
  become clickable links once set.
