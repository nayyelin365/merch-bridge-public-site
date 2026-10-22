import { siteImages } from "@/data/image-manifest.generated";
import { categoryHref, productDirections } from "@/data/products";
import NavbarClient, { type NavDirection } from "./NavbarClient";

/** Builds the menu data on the server so only names and links are sent to the browser. */
export default function Navbar() {
  const directions: NavDirection[] = productDirections.map((d) => ({
    slug: d.slug,
    name: d.name,
    href: `/products/${d.slug}`,
    categories: d.categories.map((c) => ({ name: c.name, href: categoryHref(d.slug, c.slug) })),
  }));

  return <NavbarClient directions={directions} logoSrc={siteImages.logo.src} />;
}
