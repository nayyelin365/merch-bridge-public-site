"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { ArrowRight, ChevronDown, ChevronRight, ExportIcon, ImportIcon } from "./Icons";
import styles from "./Navbar.module.css";
import type { NavDirection } from "./NavbarClient";

type Props = {
  directions: NavDirection[];
  active: boolean;
  onNavigate: () => void;
};

/**
 * Products menu: a disclosure button that opens a panel with Export / Import,
 * each of which expands to show its categories.
 * Desktop: floating panel. Mobile: expands inline inside the hamburger menu.
 */
export default function ProductDropdown({ directions, active, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const panelId = `${id}-panel`;

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    setExpanded(null);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  // Click/tap outside closes the menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  // Reset when hidden by a navigation (Next keeps recent pages mounted).
  useLayoutEffect(() => () => close(), [close]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      close(true);
    }
  };

  // Tabbing out of the menu closes it. (relatedTarget is null for taps on mobile — ignore those.)
  const onBlur = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && !rootRef.current?.contains(next)) close();
  };

  const handleNavigate = () => {
    close();
    onNavigate();
  };

  return (
    <div ref={rootRef} className={styles.dropdown} onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.navLink} ${styles.dropdownTrigger}`}
        aria-expanded={open}
        aria-controls={panelId}
        data-active={active || undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        Products
        <ChevronDown size={16} className={styles.chevron} />
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <ul className={styles.directionList}>
          {directions.map((d) => {
            const isExpanded = expanded === d.slug;
            const listId = `${id}-${d.slug}`;
            return (
              <li key={d.slug}>
                <button
                  type="button"
                  className={styles.directionButton}
                  aria-expanded={isExpanded}
                  aria-controls={listId}
                  onClick={() => setExpanded(isExpanded ? null : d.slug)}
                >
                  <span className={styles.directionIcon}>
                    {d.slug === "export" ? <ExportIcon size={20} /> : <ImportIcon size={20} />}
                  </span>
                  <span className={styles.directionText}>
                    <strong>{d.name}</strong>
                    <small>
                      {d.categories.length} {d.categories.length === 1 ? "category" : "categories"}
                    </small>
                  </span>
                  <ChevronRight size={18} className={styles.directionChevron} />
                </button>

                <ul id={listId} className={styles.categoryList} hidden={!isExpanded}>
                  {d.categories.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className={styles.categoryLink} onNavigate={handleNavigate}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href={d.href} className={styles.viewAll} onNavigate={handleNavigate}>
                      All {d.name} products <ArrowRight size={14} />
                    </Link>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
