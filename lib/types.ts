/** One image with a small (card) version and a large (lightbox) version. */
export type ImageAsset = {
  /** Original file name, used to derive the product name. */
  file: string;
  src: string;
  width: number;
  height: number;
  full: string;
  fullWidth: number;
  fullHeight: number;
};

/** Images found in one category folder, e.g. public/images/export/agri-products/. */
export type CategoryImages = {
  cover: ImageAsset | null;
  brand: ImageAsset[];
  items: ImageAsset[];
  groups: { folder: string; items: ImageAsset[] }[];
};

/** A product ready to display. */
export type Product = {
  name: string;
  image: ImageAsset;
};
