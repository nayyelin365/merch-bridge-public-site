/**
 * Turns an image file name into a display name.
 *
 *   "1. Black Gram (Black Matpe).jpg" -> "Black Gram (Black Matpe)"
 *   "2. Talapia- Freshwater.png"      -> "Talapia – Freshwater"
 *   "red_kidney-bean.jpg"             -> "Red Kidney Bean"
 *
 * A leading number ("1. ") only controls sort order and is removed.
 * Hyphens inside words ("Soft-shell", "Indo-Pacific") are kept.
 */
export function productNameFromFile(file: string): string {
  let name = file.replace(/\.[^.]+$/, ""); // extension
  name = name.replace(/^\s*\d+\s*\.\s*/, ""); // "1. " order prefix
  name = name.replace(/_/g, " ");

  if (!/\s/.test(name.trim())) {
    // slug-style name such as "red-kidney-bean": hyphens are word separators
    name = name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } else {
    name = name
      .replace(/\s*-\s*$/, "") // trailing hyphen
      .replace(/\s+-\s*|\s*-\s+/g, " – "); // spaced hyphen = separator
  }

  return name
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sort order taken from the leading number in the file name; unnumbered files go last. */
export function sortKeyFromFile(file: string): number {
  const match = file.match(/^\s*(\d+)\s*\./);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

/** Title-cases a folder name: "chilies" -> "Chilies", "dried-fruits" -> "Dried Fruits". */
export function labelFromFolder(folder: string): string {
  return folder.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
