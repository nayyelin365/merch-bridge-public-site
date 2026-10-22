import Image from "next/image";
import type { Product } from "@/lib/types";
import { ZoomIcon } from "./Icons";
import styles from "./ProductGrid.module.css";

type Props = {
  product: Product;
  onOpen: () => void;
};

export default function ProductCard({ product, onOpen }: Props) {
  const { name, image } = product;
  return (
    <figure className={styles.card}>
      <button type="button" className={styles.imageButton} onClick={onOpen} aria-haspopup="dialog">
        <Image
          src={image.src}
          alt={name}
          width={image.width}
          height={image.height}
          loading="lazy"
          className={styles.image}
        />
        <span className={styles.zoom} aria-hidden="true">
          <ZoomIcon size={20} />
        </span>
        <span className="visually-hidden">View larger image</span>
      </button>
      <figcaption className={styles.name}>{name}</figcaption>
    </figure>
  );
}
