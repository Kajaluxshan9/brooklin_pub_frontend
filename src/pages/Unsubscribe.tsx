import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { newsletterService } from "../services/newsletter.service";

type Status = "loading" | "success" | "error";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid unsubscribe link. No token provided.");
      return;
    }

    newsletterService
      .unsubscribe(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message || "You have been successfully unsubscribed.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.message || "Something went wrong. The link may be invalid or expired."
        );
      });
  }, [token]);

  return (
    <>
      <Nav />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 12, md: 16 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(108, 58, 30, 0.08)",
              }}
            >
              {status === "loading" && (
                <>
                  <CircularProgress
                    size={56}
                    sx={{ color: "#C87941", mb: 3 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 600,
                      color: "#3C1F0E",
                    }}
                  >
                    Processing...
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#6A3A1E", mt: 1, opacity: 0.8 }}
                  >
                    Please wait while we update your preferences.
                  </Typography>
                </>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 72, color: "#4CAF50", mb: 2 }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      color: "#3C1F0E",
                      mb: 1.5,
                    }}
                  >
                    Unsubscribed
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6A3A1E",
                      mb: 4,
                      maxWidth: 400,
                      mx: "auto",
                      lineHeight: 1.7,
                    }}
                  >
                    {message}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#8B7355", mb: 3 }}
                  >
                    We're sorry to see you go. You're always welcome back.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                      backgroundColor: "#C87941",
                      color: "#FDF8F3",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "#A0612F",
                      },
                    }}
                  >
                    Back to Home
                  </Button>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ErrorOutlineIcon
                    sx={{ fontSize: 72, color: "#8A2A2A", mb: 2 }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontWeight: 700,
                      color: "#3C1F0E",
                      mb: 1.5,
                    }}
                  >
                    Oops!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6A3A1E",
                      mb: 4,
                      maxWidth: 400,
                      mx: "auto",
                      lineHeight: 1.7,
                    }}
                  >
                    {message}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                      backgroundColor: "#C87941",
                      color: "#FDF8F3",
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "#A0612F",
                      },
                    }}
                  >
                    Back to Home
                  </Button>
                </motion.div>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
