import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";
import { siteImages } from "@/data/image-manifest.generated";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const { hero, logo } = siteImages;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        <picture className={styles.background}>
          <source media="(max-width: 800px)" srcSet={hero.src} />
          <Image
            src={hero.full}
            alt=""
            width={hero.fullWidth}
            height={hero.fullHeight}
            priority
            fetchPriority="high"
            className={styles.backgroundImage}
          />
        </picture>
        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.content}>
          <div className={styles.text}>
            <p className={styles.lines}>{company.businessLines.join(" • ")}</p>
            <h1 id="hero-title" className={styles.title}>
              {company.name}
            </h1>
            <p className={styles.slogan}>
              {company.slogan.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <div className={styles.actions}>
              <Link href="/products" className="btn btn-primary">
                Explore Products
              </Link>
              <Link href="/#contact" className="btn btn-outline-light">
                Contact Us
              </Link>
            </div>
          </div>

          <div className={styles.logoCard}>
            <Image
              src={logo.full}
              alt={`${company.name} logo`}
              width={logo.fullWidth}
              height={logo.fullHeight}
              priority
              className={styles.logo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
