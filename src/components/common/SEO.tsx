import { Helmet } from "react-helmet-async";

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
const SITE_NAME = "The Brooklin Pub";
const DEFAULT_DESCRIPTION =
  "The Brooklin Pub - A beloved neighborhood pub since 2014, offering great food, craft beers, and warm hospitality in Whitby, Ontario.";
const DEFAULT_IMAGE = "/og-image.jpg"; // Should be in public folder
const SITE_URL = "https://brooklinpub.com";

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

      {/* Restaurant-specific structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: SITE_NAME,
          image: fullImage,
          "@id": SITE_URL,
          url: SITE_URL,
          telephone: "(905) 425-3055",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "15 Baldwin Street",
            addressLocality: "Whitby",
            addressRegion: "ON",
            postalCode: "L1M 1A2",
            addressCountry: "CA",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 43.8765,
            longitude: -78.9417,
          },
          servesCuisine: ["American", "Pub Food", "Canadian"],
          acceptsReservations: "Yes",
        })}
      </script>
    </Helmet>
  );
}
