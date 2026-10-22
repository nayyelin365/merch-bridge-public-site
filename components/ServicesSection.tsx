import Link from "next/link";
import { ArrowRight, ExportIcon, ImportIcon, ServicesIcon } from "./Icons";
import styles from "./ServicesSection.module.css";

const services = [
  {
    icon: ExportIcon,
    title: "Export",
    text: "Sourcing agricultural, aquatic and artisan products from trusted producers and supplying them to buyers in international markets.",
    link: { href: "/products/export", label: "Export products" },
  },
  {
    icon: ImportIcon,
    title: "Import",
    text: "Bringing quality consumer products into the local market, from sourcing through to delivery.",
    link: { href: "/products/import", label: "Import products" },
  },
  {
    icon: ServicesIcon,
    title: "Business Services",
    text: "Integrated support that helps partners connect with new markets and turn trade opportunities into lasting business.",
    link: { href: "/#contact", label: "Talk to us" },
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <span className="eyebrow">Our Services</span>
        <h2 id="services-title" className="section-title">
          Integrated solutions across the trade chain
        </h2>
        <p className="section-lead">
          Export, import and business services under one roof — so partners work with a single, reliable bridge
          between markets.
        </p>

        <ul className={styles.grid}>
          {services.map(({ icon: Icon, title, text, link }) => (
            <li key={title} className={styles.card}>
              <span className={styles.icon}>
                <Icon size={28} />
              </span>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.text}>{text}</p>
              <Link href={link.href} className={styles.link}>
                {link.label} <ArrowRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
