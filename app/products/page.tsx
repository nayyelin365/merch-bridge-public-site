import type { Metadata } from "next";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import { ArrowRight } from "@/components/Icons";
import PageHeader from "@/components/PageHeader";
import { productDirections } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Export products — agri-products, aqua products, handicraft & artisan — and imported products from Merch Bridge.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Products"
        title="Products"
        summary="Explore our export and import product ranges. Select a category to view its products."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      {productDirections.map((d, i) => (
        <section key={d.slug} className={`section ${i % 2 ? "section-alt" : ""}`} aria-labelledby={`${d.slug}-title`}>
          <div className="container">
            <span className="eyebrow">{d.name}</span>
            <h2 id={`${d.slug}-title`} className="section-title">
              {d.name} products
            </h2>
            <p className="section-lead">{d.summary}</p>
            <p style={{ margin: "16px 0 40px" }}>
              <Link href={`/products/${d.slug}`} className="btn btn-outline">
                View {d.name} <ArrowRight size={16} />
              </Link>
            </p>
            <CategoryGrid directions={[d]} />
          </div>
        </section>
      ))}
    </>
  );
}
