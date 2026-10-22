import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryGrid from "@/components/CategoryGrid";
import PageHeader from "@/components/PageHeader";
import { getDirection, productDirections } from "@/data/products";

export function generateStaticParams() {
  return productDirections.map((d) => ({ direction: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[direction]">): Promise<Metadata> {
  const direction = getDirection((await params).direction);
  if (!direction) return {};
  return {
    title: `${direction.name} Products`,
    description: `${direction.summary} Categories: ${direction.categories.map((c) => c.name).join(", ")}.`,
  };
}

export default async function DirectionPage({ params }: PageProps<"/products/[direction]">) {
  const direction = getDirection((await params).direction);
  if (!direction) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={`${direction.name} Products`}
        summary={direction.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: direction.name },
        ]}
      />
      <section className="section">
        <div className="container">
          <CategoryGrid directions={[direction]} />
        </div>
      </section>
    </>
  );
}
