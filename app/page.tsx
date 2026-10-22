import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import { ArrowRight, ChatIcon, GlobeIcon, ServicesIcon } from "@/components/Icons";
import ServicesSection from "@/components/ServicesSection";
import { company } from "@/data/company";
import { productDirections } from "@/data/products";
import styles from "./page.module.css";

const quickLinks = [
  {
    href: "/products",
    icon: GlobeIcon,
    title: "Products",
    text: "Browse our export and import product ranges.",
  },
  {
    href: "/#services",
    icon: ServicesIcon,
    title: "Our Services",
    text: "Export, import and business services in one place.",
  },
  {
    href: "/#contact",
    icon: ChatIcon,
    title: "Contact",
    text: "Send us a business enquiry or request a quotation.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="section" aria-labelledby="about-title">
        <div className={`container ${styles.about}`}>
          <div>
            <span className="eyebrow">About Us</span>
            <h2 id="about-title" className="section-title">
              Your bridge between producers and markets
            </h2>
          </div>
          <div>
            <p className={styles.aboutText}>{company.description}</p>
            <ul className={styles.lines}>
              {company.businessLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container">
          <ul className={styles.quickLinks}>
            {quickLinks.map(({ href, icon: Icon, title, text }) => (
              <li key={title}>
                <Link href={href} className={styles.quickLink}>
                  <span className={styles.quickIcon}>
                    <Icon size={26} />
                  </span>
                  <span className={styles.quickText}>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </span>
                  <ArrowRight size={20} className={styles.quickArrow} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="products-title">
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className="eyebrow">Our Products</span>
              <h2 id="products-title" className="section-title">
                Export &amp; import product ranges
              </h2>
            </div>
            <Link href="/products" className="btn btn-outline">
              All products
            </Link>
          </div>
          <CategoryGrid directions={productDirections} />
        </div>
      </section>

      <ServicesSection />
      <ContactSection />
    </>
  );
}
