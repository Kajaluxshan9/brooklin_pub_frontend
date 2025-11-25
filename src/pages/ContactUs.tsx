import { useState } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { motion } from "framer-motion";
import ContactBg from "../assets/components/image-2.jpg";
import contactAnimation from "../pages/chef.json";
import Lottie from "lottie-react";
import { useApiWithCache } from "../hooks/useApi";
import { openingHoursService } from "../services/opening-hours.service";
import type { OpeningHours } from "../types/api.types";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    reason: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error" | "info",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch opening hours from backend
  const { data: openingHoursData } = useApiWithCache<OpeningHours[]>(
    "opening-hours",
    () => openingHoursService.getAllOpeningHours()
  );

  // Format opening hours for display
  const formatOpeningHours = (hours: OpeningHours[] | null) => {
    if (!hours || hours.length === 0) {
      return [
        { days: "Mon - Thu", time: "11:00 AM - 11:00 PM" },
        { days: "Fri - Sat", time: "11:00 AM - 2:00 AM" },
        { days: "Sunday", time: "11:00 AM - 11:00 PM" },
      ];
    }

    // Sort by day order
    const dayOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const sortedHours = [...hours].sort(
      (a, b) =>
        dayOrder.indexOf(a.dayOfWeek.toLowerCase()) -
        dayOrder.indexOf(b.dayOfWeek.toLowerCase())
    );

    return sortedHours.map((h) => ({
      days: h.dayOfWeek,
      time: h.isClosed ? "Closed" : `${h.openTime} - ${h.closeTime}`,
    }));
  };

  const displayHours = formatOpeningHours(openingHoursData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2)
      newErrors.name = "Please enter your full name";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.message || formData.message.trim().length < 10)
      newErrors.message = "Message should be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const apiUrl = (import.meta as any).env.VITE_API_BASE_URL || "/api";
      const resp = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (resp.ok) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Message sent successfully! We'll be in touch soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          reason: "",
          message: "",
        });
      } else {
        const subject = encodeURIComponent(
          formData.subject || "Contact from website"
        );
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${
            formData.phone || "N/A"
          }\n\n${formData.message}`
        );
        window.location.href = `mailto:brooklinpub@gmail.com?subject=${subject}&body=${body}`;
        setSnackbar({
          open: true,
          severity: "info",
          message: "Opening email client...",
        });
      }
    } catch (err) {
      const subject = encodeURIComponent(
        formData.subject || "Contact from website"
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${
          formData.phone || "N/A"
        }\n\n${formData.message}`
      );
      window.location.href = `mailto:brooklinpub@gmail.com?subject=${subject}&body=${body}`;
      setSnackbar({
        open: true,
        severity: "info",
        message: "Opening email client...",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "var(--brown-gradient)",
        backgroundImage: `url(${ContactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <RestaurantIcon
          sx={{
            position: "absolute",
            fontSize: 300,
            top: "10%",
            left: "5%",
            transform: "rotate(-15deg)",
          }}
        />
        <LocalBarIcon
          sx={{
            position: "absolute",
            fontSize: 250,
            bottom: "15%",
            right: "8%",
            transform: "rotate(25deg)",
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          pt: { xs: 12, md: 16 },
          pb: { xs: 6, md: 10 },
          px: { xs: 3, sm: 4, md: 6 },
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 800,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              color: "#3C1F0E",
              mb: 2,
              textShadow: "0 2px 8px rgba(106,58,30,0.15)",
            }}
          >
            Let's Connect
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
              color: "#6A3A1E",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Reservations, events, or just saying hello — we'd love to hear from
            you
          </Typography>
        </motion.div>
      </Box>

      {/* Main Content Container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1.2fr" },
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* Left Side - Combined Contact Information Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                p: { xs: 2.5, md: 3 },
                boxShadow: "0 8px 32px rgba(106,58,30,0.12)",
                border: "2px solid rgba(217,167,86,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Visit Us */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                <Box
                  sx={{
                    bgcolor: "#D9A756",
                    p: 1.25,
                    borderRadius: 3,
                    display: "flex",
                    mr: 2,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 28, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      color: "#3C1F0E",
                    }}
                  >
                    Visit Us
                  </Typography>
                  <Typography sx={{ color: "#6A3A1E", fontSize: "0.98rem" }}>
                    <strong>15 Baldwin Street</strong>
                    <br />
                    Whitby, ON L1M 1A2
                    <br />
                    Canada
                  </Typography>
                </Box>
              </Box>

              {/* <Divider sx={{ my: 1.5, bgcolor: "rgba(0,0,0,0.06)" }} /> */}

              {/* Get in Touch */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#D9A756",
                    p: 1.25,
                    borderRadius: 3,
                    display: "flex",
                    mt: 0.5,
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 26, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      color: "#3C1F0E",
                    }}
                  >
                    Get in Touch
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.8,
                      mt: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ color: "#D9A756", fontSize: 20 }} />
                      <Typography
                        sx={{
                          fontSize: "0.98rem",
                          color: "#3C1F0E",
                          fontWeight: 500,
                        }}
                      >
                        (905) 655-3513
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ color: "#D9A756", fontSize: 20 }} />
                      <Typography
                        sx={{
                          fontSize: "0.98rem",
                          color: "#3C1F0E",
                          fontWeight: 500,
                        }}
                      >
                        brooklinpub@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Lottie Animation Embed */}

              {/* <Divider sx={{ my: 1.5, bgcolor: "rgba(0,0,0,0.06)" }} /> */}

              {/* Opening Hours */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#D9A756",
                    p: 1.25,
                    borderRadius: 3,
                    display: "flex",
                    mt: 0.5,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 26, color: "#fff" }} />
                </Box>
                <Box sx={{ color: "#6A3A1E" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      color: "#3C1F0E",
                    }}
                  >
                    Opening Hours
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {displayHours.map((h, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.6,
                        }}
                      >
                        <Typography fontWeight={600}>{h.days}</Typography>
                        <Typography>{h.time}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: 300, md: 340 },
                    height: { xs: 180, sm: 220, md: 240 },
                  }}
                >
                  <Lottie
                    animationData={contactAnimation}
                    loop
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.12)",
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 4,
                p: { xs: 3, sm: 4, md: 5 },
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.18)",
                // subtle inner highlight
                "&:before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
                  pointerEvents: "none",
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 800,
                  color: "#3C1F0E",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Send us a Message
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#6A3A1E",
                  mb: 4,
                  fontSize: "0.95rem",
                }}
              >
                Fill out the form below and we'll get back to you within 24
                hours
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(243,227,204,0.3)",
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#D9A756" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D9A756",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                  }}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(243,227,204,0.3)",
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#D9A756" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#D9A756",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(243,227,204,0.3)",
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#D9A756" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#D9A756",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(243,227,204,0.3)",
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#D9A756" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D9A756",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                  }}
                />

                <TextField
                  select
                  fullWidth
                  label="Topic"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(243,227,204,0.3)",
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#D9A756" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D9A756",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                  }}
                >
                  <MenuItem value="">Select a topic</MenuItem>
                  <MenuItem value="general">General Inquiry</MenuItem>
                  <MenuItem value="reservation">Reservation</MenuItem>
                  <MenuItem value="event">Event Inquiry</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="jobs">Job Application</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={5}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(243,227,204,0.3)",
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#D9A756" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#D9A756",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#6A3A1E" },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: "#D9A756",
                    color: "#fff",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 4px 16px rgba(217,167,86,0.4)",
                    "&:hover": {
                      bgcolor: "#c48a3a",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 24px rgba(217,167,86,0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Box
            sx={{
              mt: { xs: 4, md: 6 },
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(106,58,30,0.15)",
              border: "3px solid #D9A756",
              height: { xs: 300, sm: 400, md: 500 },
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2872.345!2d-78.9417!3d43.8765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDUyJzM1LjQiTiA3OMKwNTYnMzAuMSJX!5e0!3m2!1sen!2sca!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Brooklin Pub Location"
            />
          </Box>
        </motion.div>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ContactUs;
