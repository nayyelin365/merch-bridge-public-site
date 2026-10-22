import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "./Icons";
import styles from "./PageHeader.module.css";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  summary?: string;
  breadcrumbs: Crumb[];
  aside?: ReactNode;
};

export default function PageHeader({ eyebrow, title, summary, breadcrumbs, aside }: Props) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div>
          <nav aria-label="Breadcrumb">
            <ol className={styles.crumbs}>
              {breadcrumbs.map((c, i) => (
                <li key={c.label}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  {i < breadcrumbs.length - 1 && <ChevronRight size={14} />}
                </li>
              ))}
            </ol>
          </nav>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={styles.title}>{title}</h1>
          {summary && <p className={styles.summary}>{summary}</p>}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </header>
  );
}
