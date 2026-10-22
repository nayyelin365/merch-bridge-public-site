import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProductCategoryGrid from "@/components/ProductCategoryGrid";
import {
  categoryHref,
  countProducts,
  getCategory,
  getCategoryImages,
  getProductGroups,
  productDirections,
} from "@/data/products";
import styles from "./page.module.css";

type Props = PageProps<"/products/[direction]/[category]">;

export function generateStaticParams() {
  return productDirections.flatMap((d) => d.categories.map((c) => ({ direction: d.slug, category: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { direction, category } = await params;
  const found = getCategory(direction, category);
  if (!found) return {};
  const cover = getCategoryImages(direction, category).cover;
  return {
    title: `${found.category.name} — ${found.direction.name}`,
    description: `${found.category.name} (${found.direction.name}): ${found.category.summary}`,
    openGraph: cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height }] } : undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { direction: directionSlug, category: categorySlug } = await params;
  const found = getCategory(directionSlug, categorySlug);
  if (!found) notFound();

  const { direction, category } = found;
  const groups = getProductGroups(direction.slug, category.slug);
  const { brand } = getCategoryImages(direction.slug, category.slug);
  const total = countProducts(direction.slug, category.slug);
  const siblings = direction.categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHeader
        eyebrow={`${direction.name} · ${total} products`}
        title={category.name}
        summary={category.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: direction.name, href: `/products/${direction.slug}` },
          { label: category.name },
        ]}
        aside={
          brand[0] ? (
            <div className={styles.brand}>
              <Image
                src={brand[0].src}
                alt={category.brand ? `${category.brand} logo` : "Brand logo"}
                width={brand[0].width}
                height={brand[0].height}
                className={styles.brandLogo}
              />
            </div>
          ) : null
        }
      />

      <section className="section">
        <div className="container">
          {groups.length ? (
            <ProductCategoryGrid groups={groups} fit={category.imageFit} aspect={category.imageAspect} />
          ) : (
            <p className={styles.empty}>Products for this category will be added soon.</p>
          )}
        </div>
      </section>

      {siblings.length > 0 && (
        <section className={`section-alt ${styles.more}`} aria-labelledby="more-title">
          <div className="container">
            <h2 id="more-title" className={styles.moreTitle}>
              More {direction.name} categories
            </h2>
            <ul className={styles.moreList}>
              {siblings.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryHref(direction.slug, c.slug)} className="btn btn-outline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
