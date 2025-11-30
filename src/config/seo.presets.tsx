import SEO from "../components/common/SEO";

/**
 * Pre-configured SEO components for common pages
 * Each component is individually exported for Fast Refresh compatibility
 * Usage: import { HomeSEO } from '../config/seo.presets';
 */

export function HomeSEO() {
  return (
    <SEO
      canonical="/"
      description="The Brooklin Pub - A beloved neighborhood pub since 2014. Great food, craft beers, live music, and warm hospitality in Whitby, Ontario."
    />
  );
}

export function AboutSEO() {
  return (
    <SEO
      title="About Us"
      canonical="/about"
      description="Learn about The Brooklin Pub's history since 2014. Family-owned pub serving great food and drinks in a welcoming atmosphere in Whitby, Ontario."
      keywords={["pub history", "family owned", "local pub"]}
    />
  );
}

export function MenuSEO() {
  return (
    <SEO
      title="Our Menu"
      canonical="/menu"
      description="Explore The Brooklin Pub's menu featuring pub classics, gourmet burgers, fresh seafood, and vegetarian options. Something for everyone!"
      type="restaurant.menu"
      keywords={["pub menu", "food menu", "burgers", "wings", "beer"]}
    />
  );
}

export function EventsSEO() {
  return (
    <SEO
      title="Events"
      canonical="/events"
      description="Check out upcoming events at The Brooklin Pub - live music, trivia nights, sports viewing, and more in Whitby, Ontario."
      keywords={["live music", "trivia night", "sports bar", "events Whitby"]}
    />
  );
}

export function ContactSEO() {
  return (
    <SEO
      title="Contact Us"
      canonical="/contactus"
      description="Contact The Brooklin Pub for reservations, private events, or inquiries. Located at 15 Baldwin Street, Whitby, Ontario."
      keywords={["reservations", "contact", "directions", "phone number"]}
    />
  );
}

interface SpecialsSEOProps {
  type?: string;
}

export function SpecialsSEO({ type = "daily" }: SpecialsSEOProps) {
  return (
    <SEO
      title={`${type.charAt(0).toUpperCase() + type.slice(1)} Specials`}
      canonical={`/special/${type}`}
      description={`Check out our ${type} specials at The Brooklin Pub. Limited time offers and chef's selections!`}
      keywords={["specials", "deals", "daily specials", "chef specials"]}
    />
  );
}
