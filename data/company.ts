/**
 * Company details shown across the site.
 *
 * Contact fields set to `null` are shown as "To be confirmed".
 * Fill them in with the official details — email and phone become clickable links automatically.
 */
export const company = {
  name: "MERCH BRIDGE COMPANY LIMITED",
  shortName: "Merch Bridge",
  slogan: ["Connecting Markets.", "Integrated Solutions.", "Creating Opportunities."],
  businessLines: ["Export", "Import", "Business Services"],
  description:
    "Merch Bridge Company Limited is a trading company working across export, import and business services — connecting producers and buyers across markets with integrated, end-to-end solutions.",

  contact: {
    address: null as string | null,
    email: null as string | null, // e.g. "info@example.com"
    phone: null as string | null, // e.g. "+95 9 000 000 000"
    hours: null as string | null, // e.g. "Monday – Friday, 9:00 – 17:00"
  },
};
