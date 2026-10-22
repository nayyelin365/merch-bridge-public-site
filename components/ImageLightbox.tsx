"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import type { Product } from "@/lib/types";
import { ChevronLeft, ChevronRight, CloseIcon } from "./Icons";
import styles from "./ImageLightbox.module.css";

type Props = {
  products: Product[];
  /** Index of the product being shown, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Full-screen image viewer built on the native <dialog> element, which provides
 * focus trapping, Escape-to-close and focus return to the opening button.
 * Left/Right arrow keys move between products.
 */
export default function ImageLightbox({ products, index, onChange }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const product = index === null ? null : products[index];
  const count = products.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  // Make sure the modal closes if the page is hidden by a navigation.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => dialog?.close();
  }, []);

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + count) % count);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  // Clicking the dark backdrop (outside the image and controls) closes the viewer.
  const onClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) onChange(null);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="lightbox-caption"
      onClose={() => onChange(null)}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      {product && (
        <div className={styles.stage} data-backdrop="true">
          <button type="button" className={styles.close} onClick={() => onChange(null)} aria-label="Close image viewer">
            <CloseIcon />
          </button>

          {count > 1 && (
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous product">
              <ChevronLeft size={28} />
            </button>
          )}

          <figure className={styles.figure}>
            <Image
              key={product.image.full}
              src={product.image.full}
              alt={product.name}
              width={product.image.fullWidth}
              height={product.image.fullHeight}
              className={styles.image}
            />
            <figcaption id="lightbox-caption" className={styles.caption}>
              <span>{product.name}</span>
              {count > 1 && (
                <span className={styles.counter}>
                  {index! + 1} / {count}
                </span>
              )}
            </figcaption>
          </figure>

          {count > 1 && (
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Next product">
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
