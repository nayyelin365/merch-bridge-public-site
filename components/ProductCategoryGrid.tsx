"use client";

import { useLayoutEffect, useMemo, useState, type CSSProperties } from "react";
import type { ProductGroup } from "@/data/products";
import ImageLightbox from "./ImageLightbox";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

type Props = {
  groups: ProductGroup[];
  fit?: "cover" | "contain";
  aspect?: string;
};

/** Grid of product cards (optionally split into labelled groups) with a shared image viewer. */
export default function ProductCategoryGrid({ groups, fit = "contain", aspect = "1 / 1" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const allProducts = useMemo(() => groups.flatMap((g) => g.products), [groups]);
  // Position of each group's first product in allProducts, so the viewer can page across groups.
  const starts = useMemo(
    () => groups.map((_, i) => groups.slice(0, i).reduce((n, g) => n + g.products.length, 0)),
    [groups],
  );

  // Close the viewer if the page is hidden by a navigation (e.g. browser back).
  useLayoutEffect(() => () => setOpenIndex(null), []);

  const style = { "--card-fit": fit, "--card-aspect": aspect } as CSSProperties;
  const showNav = groups.length > 1 && groups.every((g) => g.label);

  return (
    <div style={style}>
      {showNav && (
        <nav aria-label="Product groups" className={styles.groupNav}>
          {groups.map((g) => (
            <a key={g.label} href={`#${slug(g.label!)}`}>
              {g.label}
              <span>{g.products.length}</span>
            </a>
          ))}
        </nav>
      )}

      {groups.map((group, groupIndex) => {
        const start = starts[groupIndex];
        const headingId = group.label ? slug(group.label) : undefined;
        return (
          <section key={group.label ?? "products"} className={styles.group} aria-labelledby={headingId}>
            {group.label && (
              <h2 id={headingId} className={styles.groupTitle}>
                {group.label}
              </h2>
            )}
            <ul className={styles.grid}>
              {group.products.map((product, i) => (
                <li key={product.image.src}>
                  <ProductCard product={product} onOpen={() => setOpenIndex(start + i)} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <ImageLightbox products={allProducts} index={openIndex} onChange={setOpenIndex} />
    </div>
  );
}

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
