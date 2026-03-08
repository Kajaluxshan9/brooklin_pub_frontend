import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  InputAdornment,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import LocalBarRoundedIcon from "@mui/icons-material/LocalBarRounded";
import { newsletterService } from "../../services/newsletter.service";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await newsletterService.subscribe(email.trim());
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #9f5a32 0%, #7c401d 55%, #562c0e 100%)",
        border: "1px solid rgba(217,167,86,0.15)",
        boxShadow:
          "0 8px 40px rgba(42,21,9,0.25), 0 0 0 1px rgba(217,167,86,0.05) inset",
      }}
    >
      {/* Warm ambient glow accents */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,167,86,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,121,65,0.08) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* Top gold accent line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #D9A756, transparent)",
          opacity: 0.45,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 5, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "center" },
            gap: { xs: 3.5, md: 6 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Left side — icon + text */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              component={motion.div}
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, #D9A756 0%, #C87941 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
                boxShadow: "0 8px 28px rgba(217,167,86,0.3)",
              }}
            >
              <NotificationsActiveRoundedIcon
                sx={{ fontSize: 26, color: "#fff" }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: "1.6rem", md: "1.85rem" },
                color: "#F5EFE6",
                lineHeight: 1.2,
                mb: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Stay in the Loop
            </Typography>
            <Typography
              sx={{
                color: "rgba(245,239,230,0.5)",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                maxWidth: 360,
              }}
            >
              Get the inside scoop on upcoming events, weekly specials, and
              exclusive offers — straight to your inbox.
            </Typography>
          </Box>

          {/* Right side — form / success */}
          <Box sx={{ width: { xs: "100%", md: 420 }, flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              {success ? (
                <Box
                  component={motion.div}
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "flex-start" },
                    gap: 1.2,
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "rgba(34,197,94,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 30, color: "#22C55E" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontWeight: 700,
                      color: "#F5EFE6",
                      fontSize: "1.15rem",
                    }}
                  >
                    Welcome to the family!
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(245,239,230,0.5)",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Check your inbox — we've sent you a little welcome note.
                  </Typography>
                </Box>
              ) : (
                <Box
                  component={motion.form}
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1,
                      p: 0.7,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(217,167,86,0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="your@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={loading}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineIcon
                                sx={{
                                  fontSize: 18,
                                  color: "rgba(217,167,86,0.45)",
                                }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "transparent",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          color: "#F5EFE6",
                          "& fieldset": { border: "none" },
                          "& input::placeholder": {
                            color: "rgba(245,239,230,0.3)",
                            opacity: 1,
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        background:
                          "linear-gradient(135deg, #D9A756 0%, #C87941 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        textTransform: "none",
                        borderRadius: "12px",
                        px: 3.5,
                        py: 1.2,
                        minWidth: { xs: "100%", sm: 150 },
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 20px rgba(217,167,86,0.25)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #E8C078 0%, #D9A756 100%)",
                          boxShadow: "0 6px 28px rgba(217,167,86,0.4)",
                          transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                          background: "rgba(217,167,86,0.2)",
                          color: "rgba(255,255,255,0.5)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={18}
                          sx={{ color: "#fff" }}
                        />
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </Box>

                  <Collapse in={!!error}>
                    <Alert
                      severity="error"
                      variant="outlined"
                      onClose={() => setError("")}
                      sx={{
                        mt: 1.2,
                        borderRadius: "12px",
                        bgcolor: "rgba(239,68,68,0.08)",
                        borderColor: "rgba(239,68,68,0.25)",
                        color: "#EF4444",
                        fontSize: "0.82rem",
                        "& .MuiAlert-icon": { color: "#EF4444" },
                      }}
                    >
                      {error}
                    </Alert>
                  </Collapse>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      mt: 1.4,
                      justifyContent: { xs: "center", sm: "flex-start" },
                      pl: { xs: 0, sm: 1 },
                    }}
                  >
                    <LocalBarRoundedIcon
                      sx={{
                        fontSize: 12,
                        color: "rgba(217,167,86,0.35)",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "rgba(245,239,230,0.25)",
                        fontSize: "0.72rem",
                      }}
                    >
                      No spam — just the good stuff. Unsubscribe anytime.
                    </Typography>
                  </Box>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterSection;
