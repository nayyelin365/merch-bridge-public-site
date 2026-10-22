import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <span className="eyebrow">404</span>
        <h1 className="section-title">Page not found</h1>
        <p className="section-lead" style={{ marginInline: "auto" }}>
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <p style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/products" className="btn btn-outline">
            View products
          </Link>
        </p>
      </div>
    </section>
  );
}
