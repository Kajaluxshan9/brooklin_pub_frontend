import { Helmet } from "react-helmet-async";
import { useApiWithCache } from "../../hooks/useApi";
import { openingHoursService } from "../../services/opening-hours.service";
import type { OpeningHours } from "../../types/api.types";

interface SEOProps {
  /** Page title - will be appended with site name */
  title?: string;
  /** Meta description for SEO */
  description?: string;
  /** Canonical URL */
  canonical?: string;
  /** Open Graph image URL */
  image?: string;
  /** Page type for Open Graph */
  type?: "website" | "article" | "restaurant.menu";
  /** Additional keywords */
  keywords?: string[];
  /** Disable indexing for this page */
  noIndex?: boolean;
}

// Default values
const SITE_NAME = "Brooklin Pub & Grill";
const DEFAULT_DESCRIPTION =
  "Brooklin Pub & Grill - a neighbourhood pub in Brooklin (Whitby), Ontario since 2014. Pub food, drinks, daily specials and live events at 15 Baldwin Street.";
const DEFAULT_IMAGE = "/og-image.jpg"; // Should be in public folder
const SITE_URL = "https://brooklinpub.com";

const SCHEMA_DAYS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Admin-managed hours → schema.org openingHoursSpecification (closing before opening = next day). */
function toOpeningHoursSpec(hours: OpeningHours[] | null | undefined) {
  return (hours || [])
    .filter((h) => h.isOpen && h.isActive && h.openTime && h.closeTime && SCHEMA_DAYS[h.dayOfWeek?.toLowerCase()])
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAYS[h.dayOfWeek.toLowerCase()],
      opens: h.openTime!.slice(0, 5),
      closes: h.closeTime!.slice(0, 5),
    }));
}

/**
 * SEO Component - Manages document head for SEO optimization
 * Uses react-helmet-async for SSR-safe meta tag management
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = [],
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  // Same cache key as the footer, so this adds no extra request
  const { data: openingHours } = useApiWithCache<OpeningHours[]>("opening-hours", () =>
    openingHoursService.getAllOpeningHours()
  );
  const openingHoursSpecification = toOpeningHoursSpec(openingHours);

  // Default keywords for the pub
  const defaultKeywords = [
    "Brooklin Pub",
    "pub Whitby",
    "restaurant Brooklin Ontario",
    "craft beer",
    "live music Whitby",
    "pub food",
    "family restaurant",
    "sports bar",
    "trivia night",
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_CA" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Business structured data (schema.org BarOrPub) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BarOrPub",
          "@id": `${SITE_URL}/#pub`,
          name: SITE_NAME,
          alternateName: "Brooklin Pub",
          description: DEFAULT_DESCRIPTION,
          url: SITE_URL,
          image: [`${SITE_URL}/og-image.jpg`, `${SITE_URL}/brooklinpub-logo.png`],
          logo: `${SITE_URL}/brooklinpub-logo.png`,
          telephone: "+1-905-425-3055",
          email: "brooklinpub@gmail.com",
          priceRange: "$$",
          foundingDate: "2014",
          address: {
            "@type": "PostalAddress",
            streetAddress: "15 Baldwin Street",
            addressLocality: "Whitby",
            addressRegion: "ON",
            postalCode: "L1M 1A2",
            addressCountry: "CA",
          },
          areaServed: ["Brooklin", "Whitby", "Durham Region"],
          hasMap: "https://maps.google.com/?q=15+Baldwin+St,+Whitby,+ON+L1M+1A2",
          menu: `${SITE_URL}/menu`,
          hasMenu: `${SITE_URL}/menu`,
          servesCuisine: ["Pub Food", "Canadian", "American"],
          acceptsReservations: "True",
          ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
          sameAs: [
            "https://www.facebook.com/brooklinpub",
            "https://www.instagram.com/brooklinpubngrill/",
            "https://www.tiktok.com/@brooklinpubngrill",
          ],
        })}
      </script>
    </Helmet>
  );
}
