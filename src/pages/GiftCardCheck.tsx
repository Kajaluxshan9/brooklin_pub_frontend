import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import HeroSection from "../components/common/HeroSection";
import SEO from "../components/common/SEO";
import {
  giftCardsService,
  normalizeGiftCardCode,
  GiftCardApiError,
  type GiftCardCheckResult,
  type GiftCardStatus,
} from "../services/giftcards.service";

const BROWN = "#6A3A1E";
const PUB_PHONE = "(905) 425-3055";
const CODE_RE = /^BPGC-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

const STATUS: Record<GiftCardStatus, { label: string; color: "warning" | "success" | "error" | "default" | "info"; text: string }> = {
  pending_verification: { label: "Awaiting payment verification", color: "warning", text: "We've received your order and are verifying your payment. The recipient will be emailed the gift card and PIN once approved." },
  active: { label: "Active", color: "success", text: "This gift card is active and ready to use at the pub." },
  rejected: { label: "Not approved", color: "error", text: "We couldn't verify the payment for this order." },
  fully_redeemed: { label: "Fully used", color: "default", text: "The full balance of this gift card has been used." },
  frozen: { label: "On hold", color: "info", text: "This gift card is temporarily on hold. Please contact us." },
  void: { label: "Cancelled", color: "error", text: "This gift card has been cancelled. Please contact us." },
};

const money = (n: number | null | undefined) => `$${(n ?? 0).toFixed(2)}`;
const date = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric", timeZone: "America/Toronto" }) : "—");

export default function GiftCardCheck() {
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GiftCardCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const normalized = normalizeGiftCardCode(code);
  const codeValid = CODE_RE.test(normalized);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeValid) {
      setError("Please enter a valid Gift Card ID, e.g. BPGC-7K3M-Q9XA");
      return;
    }
    setLoading(true);
    setError(null);
    setLocked(false);
    setResult(null);
    try {
      setResult(await giftCardsService.check(normalized, pin || undefined));
    } catch (err) {
      if (err instanceof GiftCardApiError && err.locked) setLocked(true);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? STATUS[result.status] : null;

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <AnimatedBackground variant="subtle" />
      <SEO title="Check Gift Card" canonical="/gift-cards/check" description="Check your Brooklin Pub gift card balance or order status." noIndex />
      <Nav />
      <HeroSection id="giftcard-check-hero" title="Check Your Gift Card" subtitle="See your order status with your Gift Card ID, or your balance with your ID and PIN." overlineText="✦ GIFT CARDS ✦" variant="light" />

      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 }, px: { xs: 2, md: 3 }, position: "relative" }}>
        <Box component="form" onSubmit={check} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: "rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(108,58,30,0.08)" }}>
          <TextField
            fullWidth
            label="Gift Card ID"
            placeholder="BPGC-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onBlur={() => codeValid && setCode(normalized)}
            slotProps={{ htmlInput: { style: { fontFamily: "monospace", letterSpacing: 2 }, autoComplete: "off" } }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="PIN (optional — needed to see the balance)"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            slotProps={{ htmlInput: { inputMode: "numeric", autoComplete: "off", maxLength: 4 } }}
            helperText="Buyers can leave this empty to check the order status."
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading || !code.trim() || (pin.length > 0 && pin.length < 4)} sx={{ mt: 3, bgcolor: BROWN, "&:hover": { bgcolor: "#3C1F0E" } }}>
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : pin ? "Check balance" : "Check status"}
          </Button>
        </Box>

        {error && (
          <Alert severity={locked ? "warning" : "error"} icon={locked ? <LockIcon /> : undefined} sx={{ mt: 3 }}>
            {error}
            {locked && (
              <Box sx={{ mt: 1 }}>
                <Button size="small" href={`tel:${PUB_PHONE}`} sx={{ mr: 1 }}>Call {PUB_PHONE}</Button>
                <Button size="small" component={RouterLink} to="/contactus">Contact Us</Button>
              </Box>
            )}
          </Alert>
        )}

        {result && meta && (
          <Box sx={{ mt: 3, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: "rgba(255,255,255,0.95)", boxShadow: "0 8px 32px rgba(108,58,30,0.08)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem" }}>{result.code}</Typography>
              <Chip label={meta.label} color={meta.color} />
            </Box>

            {result.pinVerified && result.balance !== undefined ? (
              <Box sx={{ textAlign: "center", my: 3 }}>
                <Typography variant="overline" sx={{ color: "#8B6914" }}>Available balance</Typography>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "3.2rem", fontWeight: 700, color: BROWN, lineHeight: 1 }}>{money(result.balance)}</Typography>
                <Typography variant="body2" color="text.secondary">of {money(result.approvedAmount)} original value</Typography>
              </Box>
            ) : (
              <Typography sx={{ mt: 2 }}>{meta.text}</Typography>
            )}

            <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 0.75, fontSize: "0.95rem" }}>
              <Typography variant="body2" color="text.secondary">Purchased</Typography>
              <Typography variant="body2">{date(result.purchasedAt)}</Typography>
              <Typography variant="body2" color="text.secondary">Amount requested</Typography>
              <Typography variant="body2">{money(result.requestedAmount)}</Typography>
              {result.approvedAmount !== null && (
                <>
                  <Typography variant="body2" color="text.secondary">Amount approved</Typography>
                  <Typography variant="body2">{money(result.approvedAmount)}</Typography>
                  <Typography variant="body2" color="text.secondary">Activated</Typography>
                  <Typography variant="body2">{date(result.activatedAt)}</Typography>
                </>
              )}
            </Box>

            {result.amountAdjusted && (
              <Alert severity="info" sx={{ mt: 2 }}>
                We received {money(result.approvedAmount)} (you requested {money(result.requestedAmount)}), so the gift card was issued for {money(result.approvedAmount)}.
              </Alert>
            )}
            {result.status === "rejected" && result.rejectionReason && (
              <Alert severity="error" sx={{ mt: 2 }}>Reason: {result.rejectionReason}</Alert>
            )}
            {result.isLocked && (
              <Alert severity="warning" icon={<LockIcon />} sx={{ mt: 2 }}>This gift card is locked. Please contact us to unlock it.</Alert>
            )}

            {result.history && result.history.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color: BROWN, mb: 1 }}>History</Typography>
                {result.history.map((h, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.75, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <Typography variant="body2">
                      {h.type === "redeem" ? "Used at the pub" : h.type === "issue" ? "Gift card issued" : h.type === "void" ? "Cancelled" : "Balance adjustment"} · {date(h.date)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: h.amount < 0 ? "error.main" : "success.main" }}>
                      {h.amount < 0 ? "−" : "+"}{money(Math.abs(h.amount))}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {!result.pinVerified && result.status === "active" && (
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>Enter the 4-digit PIN from the gift card email to see the balance.</Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, textAlign: "center", color: BROWN }}>
          <Typography variant="body2">
            Questions about a gift card? Call <a href={`tel:${PUB_PHONE}`} style={{ color: BROWN }}>{PUB_PHONE}</a> or use our{" "}
            <Link component={RouterLink} to="/contactus" sx={{ color: BROWN }}>Contact Us</Link> form and quote your Gift Card ID.
          </Typography>
          <Button component={RouterLink} to="/gift-cards" sx={{ mt: 2, color: BROWN }}>Buy a gift card →</Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
