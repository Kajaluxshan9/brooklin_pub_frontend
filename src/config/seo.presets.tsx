import SEO from "../components/common/SEO";

/**
 * Pre-configured SEO components for common pages
 * Each component is individually exported for Fast Refresh compatibility
 * Usage: import { HomeSEO } from '../config/seo.presets';
 */

export function HomeSEO() {
  return (
    <SEO
      title="Pub, Food & Live Events in Brooklin (Whitby), ON"
      canonical="/"
      description="Brooklin Pub & Grill at 15 Baldwin Street, Brooklin (Whitby), Ontario. Neighbourhood pub since 2014 with pub food, drinks, daily specials, live events and gift cards. Call (905) 425-3055."
    />
  );
}

export function AboutSEO() {
  return (
    <SEO
      title="About Us"
      canonical="/about"
      description="Learn about Brooklin Pub & Grill's history since 2014. Family-owned pub serving great food and drinks in a welcoming atmosphere in Whitby, Ontario."
      keywords={["pub history", "family owned", "local pub"]}
    />
  );
}

export function MenuSEO() {
  return (
    <SEO
      title="Our Menu"
      canonical="/menu"
      description="Explore Brooklin Pub & Grill's menu featuring pub classics, gourmet burgers, fresh seafood, and vegetarian options. Something for everyone!"
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
      description="Check out upcoming events at Brooklin Pub & Grill - live music, trivia nights, sports viewing, and more in Whitby, Ontario."
      keywords={["live music", "trivia night", "sports bar", "events Whitby"]}
    />
  );
}

export function ContactSEO() {
  return (
    <SEO
      title="Contact Us"
      canonical="/contactus"
      description="Contact Brooklin Pub & Grill for reservations, private events, or inquiries. Located at 15 Baldwin Street, Whitby, Ontario."
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
      description={`Check out our ${type} specials at Brooklin Pub & Grill. Limited time offers and chef's selections!`}
      keywords={["specials", "deals", "daily specials", "chef specials"]}
    />
  );
}
