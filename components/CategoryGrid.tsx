import { categoryHref, countProducts, getCategoryPreview, type ProductDirection } from "@/data/products";
import CategoryCard from "./CategoryCard";
import styles from "./CategoryGrid.module.css";

/** Cards linking to each category of one or more directions (Export / Import). */
export default function CategoryGrid({ directions }: { directions: ProductDirection[] }) {
  return (
    <ul className={styles.grid}>
      {directions.flatMap((d) =>
        d.categories.map((c) => (
          <li key={`${d.slug}/${c.slug}`}>
            <CategoryCard
              href={categoryHref(d.slug, c.slug)}
              name={c.name}
              summary={c.summary}
              tag={d.name}
              count={countProducts(d.slug, c.slug)}
              image={getCategoryPreview(d.slug, c.slug)}
            />
          </li>
        )),
      )}
    </ul>
  );
}
