import { Box, Container, Typography, Divider } from "@mui/material";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HeroSection from "../components/common/HeroSection";
import SEO from "../components/common/SEO";

const LAST_UPDATED = "March 29, 2025";
const CONTACT_EMAIL = "info@brooklinpub.com";
const BUSINESS_ADDRESS = "15 Baldwin St, Whitby, ON L1M 1A2";
const BUSINESS_PHONE = "(905) 425-3055";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 4 }}>
    <Typography
      variant="h5"
      sx={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 700,
        color: "#6A3A1E",
        mb: 1.5,
        mt: 0.5,
      }}
    >
      {title}
    </Typography>
    <Divider sx={{ mb: 2, borderColor: "rgba(217,167,86,0.35)" }} />
    {children}
  </Box>
);

const Para = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="body1"
    sx={{ color: "#3C1F0E", lineHeight: 1.85, mb: 1.5, fontSize: "0.97rem" }}
  >
    {children}
  </Typography>
);

export default function TermsAndConditions() {
  return (
    <Box sx={{ minHeight: "100vh", background: "transparent", position: "relative", overflow: "visible" }}>
      <AnimatedBackground variant="subtle" />
      <SEO
        title="Terms & Conditions"
        canonical="/terms-and-conditions"
        description="Terms and Conditions for using the Brooklin Pub & Grill website and mobile application."
        keywords={["terms and conditions", "terms of use", "Brooklin Pub"]}
      />
      <Nav />

      <HeroSection
        id="terms-hero"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or mobile app"
        overlineText="✦ TERMS OF USE ✦"
        variant="light"
      />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            bgcolor: "rgba(217,167,86,0.08)",
            border: "1px solid rgba(217,167,86,0.25)",
            borderRadius: "12px",
            p: { xs: 2.5, md: 3 },
            mb: 5,
          }}
        >
          <Typography
            sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#B8923F", letterSpacing: "0.12em", textTransform: "uppercase", mb: 1 }}
          >
            Last Updated: {LAST_UPDATED}
          </Typography>
          <Para>
            These Terms and Conditions govern the collection, use, and disclosure of personal
            information through the Brooklin Pub &amp; Grill website and mobile application
            ("we", "our", or "us"). By using our service, you agree to the collection and
            use of information in accordance with these terms.
          </Para>
        </Box>

        <Section title="1. Collection of Personal Information">
          <Para>
            We collect personal information that you provide directly to us when you submit
            a contact or reservation inquiry, sign up for our newsletter, or interact with
            our service. This may include your name, email address, phone number, and
            message content.
          </Para>
        </Section>

        <Section title="2. Use of Personal Information">
          <Para>
            Your personal information is used to respond to your inquiries, process
            reservation requests, provide customer support, and improve our services.
            We may also use your information to communicate with you about promotions
            and updates related to our services.
          </Para>
        </Section>

        <Section title="3. Disclosure of Personal Information">
          <Para>
            We do not sell, trade, or rent your personal information to third parties.
            Your information may be shared with third-party service providers who perform
            services on our behalf, such as email delivery. These third parties are
            obligated to protect your information and may not use it for any other purpose.
          </Para>
        </Section>

        <Section title="4. Consent">
          <Para>
            By using our service, you consent to the collection, use, and disclosure of
            your personal information as outlined in these terms. You may withdraw your
            consent at any time by contacting us, but this may affect your ability to
            use certain features of our service.
          </Para>
        </Section>

        <Section title="5. Newsletter & Promotional Codes">
          <Para>
            By subscribing to our newsletter, you consent to receive promotional emails
            from Brooklin Pub &amp; Grill. You may unsubscribe at any time using the
            link in any of our emails or by contacting us directly.
          </Para>
          <Para>
            Promotional codes distributed via newsletter are subject to individual terms
            and expiry dates. Codes are non-transferable and cannot be combined with
            other offers unless stated otherwise.
          </Para>
        </Section>

        <Section title="6. Menu, Pricing & Availability">
          <Para>
            Menu items, descriptions, and prices displayed on our platform are for
            informational purposes only and are subject to change without notice.
            In-restaurant pricing at the time of your visit is authoritative.
          </Para>
          <Para>
            Allergen information is provided as a general guide. If you have a food
            allergy or dietary restriction, please inform your server before ordering.
          </Para>
        </Section>

        <Section title="7. Events">
          <Para>
            Event listings (dates, times, performers) are subject to change or
            cancellation without notice. Guests are encouraged to confirm event details
            directly with us before attending.
          </Para>
        </Section>

        <Section title="8. Changes to These Terms">
          <Para>
            We may update these Terms from time to time. We will notify you of any
            changes by posting the updated Terms on our website. Continued use of our
            platform after changes are posted constitutes your acceptance of the
            revised Terms.
          </Para>
        </Section>

        <Section title="9. Contact Us">
          <Para>If you have any questions about these Terms and Conditions, please contact us:</Para>
          <Box
            sx={{
              bgcolor: "rgba(106,58,30,0.05)",
              border: "1px solid rgba(106,58,30,0.12)",
              borderRadius: "10px",
              p: { xs: 2.5, md: 3 },
              mt: 1,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, color: "#6A3A1E", mb: 0.5, fontFamily: '"Cormorant Garamond", serif', fontSize: "1.1rem" }}
            >
              Brooklin Pub &amp; Grill
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", color: "#3C1F0E", lineHeight: 2 }}>
              {BUSINESS_ADDRESS}
              <br />
              Phone: {BUSINESS_PHONE}
              <br />
              Email:{" "}
              <Box component="a" href={`mailto:${CONTACT_EMAIL}`} sx={{ color: "#6A3A1E", fontWeight: 600 }}>
                {CONTACT_EMAIL}
              </Box>
            </Typography>
          </Box>
        </Section>
      </Container>

      <Box sx={{ height: { xs: 0, md: 40 }, background: "transparent" }} />
      <Footer />
    </Box>
  );
}
