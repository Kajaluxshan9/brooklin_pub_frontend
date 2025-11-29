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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { motion } from "framer-motion";
import ContactBg from "../assets/images/hero-bg.jpg";
import contactAnimation from "../assets/animations/contact-animation.json";
import Lottie from "lottie-react";
import { useApiWithCache } from "../hooks/useApi";
import { openingHoursService } from "../services/opening-hours.service";
import type { OpeningHours } from "../types/api.types";

// Subject/Reason options for the dropdown
const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "reservation", label: "Table Reservation" },
  { value: "event", label: "Event Inquiry" },
  { value: "catering", label: "Catering Request" },
  { value: "feedback", label: "Feedback" },
  { value: "jobs", label: "Job Application" },
  { value: "other", label: "Other" },
];

// Generate time slots for reservation
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 11; hour <= 22; hour++) {
    const h = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    slots.push(`${h}:00 ${ampm}`);
    slots.push(`${h}:30 ${ampm}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Guest count options
const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "10+"];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    reservationDate: "",
    reservationTime: "",
    guestCount: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error" | "info",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if reservation is selected
  const isReservation = formData.subject === "reservation";

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

    return sortedHours.map((h) => {
      // Check if day is closed (isOpen=false or isActive=false or no times set)
      const isClosed = !h.isOpen || !h.isActive || !h.openTime || !h.closeTime;
      return {
        days: h.dayOfWeek,
        time: isClosed ? "Closed" : `${h.openTime} - ${h.closeTime}`,
      };
    });
  };

  const displayHours = formatOpeningHours(openingHoursData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2)
      newErrors.name = "Please enter your full name";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.subject) newErrors.subject = "Please select a subject";

    // Reservation-specific validations
    if (isReservation) {
      if (!formData.reservationDate)
        newErrors.reservationDate = "Please select a date";
      if (!formData.reservationTime)
        newErrors.reservationTime = "Please select a time";
      if (!formData.guestCount)
        newErrors.guestCount = "Please select number of guests";
    }

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

      // Build message with reservation details if applicable
      let fullMessage = formData.message;
      if (isReservation) {
        fullMessage = `RESERVATION REQUEST\n\nDate: ${formData.reservationDate}\nTime: ${formData.reservationTime}\nNumber of Guests: ${formData.guestCount}\n\nAdditional Notes:\n${formData.message}`;
      }

      const resp = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          message: fullMessage,
        }),
      });
      if (resp.ok) {
        setSnackbar({
          open: true,
          severity: "success",
          message: isReservation
            ? "Reservation request sent! We'll confirm your booking soon."
            : "Message sent successfully! We'll be in touch soon.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          reservationDate: "",
          reservationTime: "",
          guestCount: "",
          message: "",
        });
      } else {
        const subjectLine = isReservation
          ? `Reservation Request - ${formData.reservationDate}`
          : formData.subject || "Contact from website";
        const subject = encodeURIComponent(subjectLine);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"
          }\n\n${fullMessage}`
        );
        window.location.href = `mailto:brooklinpub@gmail.com?subject=${subject}&body=${body}`;
        setSnackbar({
          open: true,
          severity: "info",
          message: "Opening email client...",
        });
      }
    } catch (err) {
      const subjectLine = isReservation
        ? `Reservation Request - ${formData.reservationDate}`
        : formData.subject || "Contact from website";
      const subject = encodeURIComponent(subjectLine);

      let fullMessage = formData.message;
      if (isReservation) {
        fullMessage = `RESERVATION REQUEST\n\nDate: ${formData.reservationDate}\nTime: ${formData.reservationTime}\nNumber of Guests: ${formData.guestCount}\n\nAdditional Notes:\n${formData.message}`;
      }

      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"
        }\n\n${fullMessage}`
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
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />

      {/* Hero Section - consistent with other pages */}
      <Box
        sx={{
          minHeight: { xs: "40vh", sm: "50vh", md: "60vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
          pt: { xs: 8, sm: 6, md: 0 },
          backgroundImage: `url(${ContactBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(60,31,14,0.7) 0%, rgba(106,58,30,0.6) 100%)",
          },
        }}
      >
        {/* Decorative overlay pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(217,167,86,0.1) 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, rgba(217,167,86,0.08) 0%, transparent 50%)`,
            pointerEvents: "none",
          }}
        />

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Decorative line above */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              width: 80,
              height: 2,
              backgroundColor: "#D9A756",
              mb: 2,
            }}
          />

          <Typography
            component={motion.h1}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            sx={{
              margin: 0,
              color: "#F3E3CC",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              letterSpacing: { xs: 1, sm: 2, md: 4 },
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
              lineHeight: 1.2,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            sx={{
              mt: { xs: 1.5, md: 2 },
              color: "rgba(243, 227, 204, 0.9)",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: { xs: 0.5, md: 1 },
              maxWidth: { xs: "90%", md: 600 },
              px: 2,
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            Reservations, events, or just saying hello — we'd love to hear from
            you
          </Typography>

          {/* Decorative line below */}
          <Box
            component={motion.div}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              width: 120,
              height: 2,
              backgroundColor: "#D9A756",
              mt: 3,
            }}
          />
        </Box>
      </Box>

      {/* Background wrapper for main content */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #F3E3CC 0%, #E8D4B8 100%)",
          minHeight: "100vh",
          py: { xs: 4, sm: 6, md: 10 },
          pb: { xs: 12, md: 10 },
        }}
      >
        {/* Main Content Container */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1400,
            mx: "auto",
            px: { xs: 1.5, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1.2fr" },
              gap: { xs: 3, sm: 4, md: 5 },
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
                  borderRadius: { xs: 3, md: 4 },
                  p: { xs: 2, sm: 2.5, md: 3 },
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
                        fontFamily: '"Cormorant Garamond", serif',
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
                        fontFamily: '"Cormorant Garamond", serif',
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                        fontFamily: '"Cormorant Garamond", serif',
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
                  borderRadius: { xs: 3, md: 4 },
                  p: { xs: 2.5, sm: 3, md: 5 },
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
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 800,
                    color: "#3C1F0E",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
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
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#6A3A1E",
                        },
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
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#6A3A1E",
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    select
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    error={!!errors.subject}
                    helperText={errors.subject}
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
                    <MenuItem value="">Select a subject</MenuItem>
                    {subjectOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Reservation Fields - shown only when reservation is selected */}
                  {isReservation && (
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: "rgba(217, 167, 86, 0.1)",
                        border: "1px dashed rgba(217, 167, 86, 0.4)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CalendarMonthIcon sx={{ color: "#D9A756" }} />
                        <Typography sx={{ fontWeight: 600, color: "#3C1F0E" }}>
                          Reservation Details
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: 2.5,
                        }}
                      >
                        <TextField
                          fullWidth
                          label="Reservation Date"
                          name="reservationDate"
                          type="date"
                          value={formData.reservationDate}
                          onChange={handleChange}
                          required
                          error={!!errors.reservationDate}
                          helperText={errors.reservationDate}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "rgba(255,255,255,0.5)",
                              borderRadius: 2,
                              "&:hover fieldset": { borderColor: "#D9A756" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#D9A756",
                                borderWidth: 2,
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#6A3A1E",
                            },
                          }}
                        />

                        <TextField
                          select
                          fullWidth
                          label="Preferred Time"
                          name="reservationTime"
                          value={formData.reservationTime}
                          onChange={handleChange}
                          required
                          error={!!errors.reservationTime}
                          helperText={errors.reservationTime}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "rgba(255,255,255,0.5)",
                              borderRadius: 2,
                              "&:hover fieldset": { borderColor: "#D9A756" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#D9A756",
                                borderWidth: 2,
                              },
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#6A3A1E",
                            },
                          }}
                        >
                          <MenuItem value="">Select a time</MenuItem>
                          {timeSlots.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <TextField
                        select
                        fullWidth
                        label="Number of Guests"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleChange}
                        required
                        error={!!errors.guestCount}
                        helperText={errors.guestCount}
                        InputProps={{
                          startAdornment: (
                            <GroupIcon sx={{ color: "#D9A756", mr: 1 }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "rgba(255,255,255,0.5)",
                            borderRadius: 2,
                            "&:hover fieldset": { borderColor: "#D9A756" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#D9A756",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#6A3A1E",
                          },
                        }}
                      >
                        <MenuItem value="">Select number of guests</MenuItem>
                        {guestOptions.map((count) => (
                          <MenuItem key={count} value={count.toString()}>
                            {count}{" "}
                            {count === 1
                              ? "Guest"
                              : count === "10+"
                              ? " Guests (Large Party)"
                              : "Guests"}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label={
                      isReservation
                        ? "Special Requests / Notes"
                        : "Your Message"
                    }
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={isReservation ? 3 : 5}
                    placeholder={
                      isReservation
                        ? "Any dietary restrictions, special occasions, seating preferences..."
                        : ""
                    }
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
                mt: { xs: 3, sm: 4, md: 6 },
                borderRadius: { xs: 3, md: 4 },
                overflow: "hidden",
                boxShadow: "0 12px 48px rgba(106,58,30,0.15)",
                border: "3px solid #D9A756",
                height: { xs: 250, sm: 350, md: 500 },
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
    </div>
  );
};

export default ContactUs;

