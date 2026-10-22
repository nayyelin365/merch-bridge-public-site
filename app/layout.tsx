import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { company } from "@/data/company";
import { siteImages } from "@/data/image-manifest.generated";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Public URL of the deployed site, used for absolute social-share image links.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com) when building for production.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${company.name} | Export • Import • Business Services`,
    template: `%s | ${company.shortName}`,
  },
  description: `${company.name} — ${company.slogan.join(" ")} Export, import and business services.`,
  applicationName: company.name,
  keywords: ["Merch Bridge", "export", "import", "trading company", "agri-products", "aqua products", "handicrafts"],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    siteName: company.name,
    title: company.name,
    description: company.slogan.join(" "),
    images: [{ url: siteImages.hero.full, width: siteImages.hero.fullWidth, height: siteImages.hero.fullHeight }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f3d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geistSans.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
