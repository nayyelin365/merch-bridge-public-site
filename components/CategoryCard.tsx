import Image from "next/image";
import Link from "next/link";
import type { ImageAsset } from "@/lib/types";
import { ArrowRight } from "./Icons";
import styles from "./CategoryCard.module.css";

type Props = {
  href: string;
  name: string;
  summary: string;
  tag: string;
  count: number;
  image: ImageAsset | null;
};

export default function CategoryCard({ href, name, summary, tag, count, image }: Props) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            loading="lazy"
            className={styles.image}
          />
        ) : (
          <span className={styles.placeholder}>Images coming soon</span>
        )}
        <span className={styles.tag}>{tag}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.summary}>{summary}</p>
        <span className={styles.more}>
          {count > 0 ? `View ${count} products` : "View category"} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
