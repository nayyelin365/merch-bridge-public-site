"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./Icons";
import styles from "./Navbar.module.css";
import ProductDropdown from "./ProductDropdown";

export type NavDirection = {
  slug: string;
  name: string;
  href: string;
  categories: { name: string; href: string }[];
};

const DESKTOP_QUERY = "(min-width: 961px)";

export default function NavbarClient({ directions, logoSrc }: { directions: NavDirection[]; logoSrc: string }) {
  const pathname = (usePathname() ?? "/").replace(/(.)\/$/, "$1");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMenuOpen(false);

  // Escape closes the mobile menu; switching to desktop width resets it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => mq.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    document.documentElement.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onNavigate={closeMenu} aria-label="Merch Bridge — home">
          <Image src={logoSrc} alt="" width={44} height={44} priority className={styles.brandLogo} />
          <span className={styles.brandText}>
            <strong>Merch Bridge</strong>
            <small>Company Limited</small>
          </span>
        </Link>

        <nav
          id="site-nav"
          aria-label="Main"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            <li>
              <Link
                href="/"
                className={styles.navLink}
                aria-current={pathname === "/" ? "page" : undefined}
                onNavigate={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <ProductDropdown
                directions={directions}
                active={pathname.startsWith("/products")}
                onNavigate={closeMenu}
              />
            </li>
            <li>
              <Link href="/#services" className={styles.navLink} onNavigate={closeMenu}>
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/#contact" className={styles.navLink} onNavigate={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
