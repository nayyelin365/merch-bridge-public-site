import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";
import { siteImages } from "@/data/image-manifest.generated";
import { categoryHref, productDirections } from "@/data/products";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image src={siteImages.logo.src} alt="" width={56} height={56} className={styles.logo} />
          <div>
            <p className={styles.name}>{company.name}</p>
            <p className={styles.slogan}>{company.slogan.join(" ")}</p>
          </div>
        </div>

        <nav aria-label="Footer" className={styles.columns}>
          <div>
            <h2 className={styles.heading}>Company</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/#services">Our Services</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </div>
          {productDirections.map((d) => (
            <div key={d.slug}>
              <h2 className={styles.heading}>{d.name}</h2>
              <ul>
                {d.categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={categoryHref(d.slug, c.slug)}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>
            &copy; {company.name}. All rights reserved. · {company.businessLines.join(" • ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
