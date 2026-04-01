import { Box, Container, Typography, Divider } from "@mui/material";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HeroSection from "../components/common/HeroSection";
import SEO from "../components/common/SEO";

const LAST_UPDATED = "March 29, 2025";
const CONTACT_EMAIL = "brooklinpub@gmail.com";
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
    sx={{
      color: "#3C1F0E",
      lineHeight: 1.85,
      mb: 1.5,
      fontSize: "0.97rem",
    }}
  >
    {children}
  </Typography>
);

export default function PrivacyPolicy() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
        overflow: "visible",
      }}
    >
      <AnimatedBackground variant="subtle" />
      <SEO
        title="Privacy Policy"
        canonical="/privacy-policy"
        description="Privacy Policy for Brooklin Pub & Grill. Learn how we collect, use, and protect your personal information."
        keywords={["privacy policy", "personal information", "Brooklin Pub"]}
      />
      <Nav />

      <HeroSection
        id="privacy-hero"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information"
        overlineText="✦ YOUR PRIVACY MATTERS ✦"
        variant="light"
      />

      <Container
        maxWidth="md"
        sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, md: 4 } }}
      >
        {/* Intro */}
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
            sx={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#B8923F",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Last Updated: {LAST_UPDATED}
          </Typography>
          <Para>
            This Privacy Policy outlines how Brooklin Pub &amp; Grill ("we",
            "our", or "us") collects, uses, discloses, and protects the personal
            information of our guests and website visitors in compliance with
            Canadian privacy laws.
          </Para>
        </Box>

        <Section title="1. Collection of Information">
          <Para>
            We collect information that you provide to us directly, such as when
            you submit a contact or reservation inquiry, sign up for our
            newsletter, or contact customer support. We may also collect basic
            information automatically when you use our website, such as your IP
            address and browsing behaviour, for security and performance
            purposes.
          </Para>
        </Section>

        <Section title="2. Use of Information">
          <Para>
            Your information is used to respond to your inquiries, process
            reservation requests, send you our newsletter and promotions (with
            your consent), and improve our services. We may also use your
            information for marketing purposes with your consent.
          </Para>
        </Section>

        <Section title="3. Disclosure of Information">
          <Para>
            We do not sell, trade, or rent your personal information to third
            parties. Your information may be shared with third-party service
            providers who perform functions on our behalf, such as email
            delivery. We require these third parties to protect your information
            and use it solely for the purposes for which it was disclosed.
          </Para>
        </Section>

        <Section title="4. Email Communications">
          <Para>
            We will only send promotional emails to individuals who have
            subscribed to our newsletter. Each email includes a clear
            unsubscribe link. You can unsubscribe at any time by clicking the
            link in any of our emails or by contacting us at{" "}
            <Box
              component="a"
              href={`mailto:${CONTACT_EMAIL}`}
              sx={{ color: "#6A3A1E", fontWeight: 600 }}
            >
              {CONTACT_EMAIL}
            </Box>
            .
          </Para>
        </Section>

        <Section title="5. Security of Personal Information">
          <Para>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </Para>
        </Section>

        <Section title="6. Access to Your Information">
          <Para>
            You have the right to access, update, or delete your personal
            information. Please contact us to exercise these rights.
          </Para>
        </Section>

        <Section title="7. Changes to This Policy">
          <Para>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the updated policy on our website.
          </Para>
        </Section>

        <Section title="8. Contact Us">
          <Para>
            If you have any questions about this Privacy Policy, please contact
            us:
          </Para>
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
              sx={{
                fontWeight: 700,
                color: "#6A3A1E",
                mb: 0.5,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: "1.1rem",
              }}
            >
              Brooklin Pub &amp; Grill
            </Typography>
            <Typography
              sx={{ fontSize: "0.95rem", color: "#3C1F0E", lineHeight: 2 }}
            >
              {BUSINESS_ADDRESS}
              <br />
              Phone: {BUSINESS_PHONE}
              <br />
              Email:{" "}
              <Box
                component="a"
                href={`mailto:${CONTACT_EMAIL}`}
                sx={{ color: "#6A3A1E", fontWeight: 600 }}
              >
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
