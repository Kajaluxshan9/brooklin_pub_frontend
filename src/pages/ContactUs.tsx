import { useState } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/common/AnimatedBackground";
import MenuBackground from "../components/menu/MenuBackground";
import HeroSection from "../components/common/HeroSection";
import { ContactSEO } from "../config/seo.presets";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  Container,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkIcon from "@mui/icons-material/Work";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";
import { motion, AnimatePresence } from "framer-motion";
import contactAnimation from "../assets/animations/contact-animation.json";
import Lottie from "lottie-react";
import { useApiWithCache } from "../hooks/useApi";
import { openingHoursService } from "../services/opening-hours.service";
import {
  contactService,
  type ContactFormData,
} from "../services/contact.service";
import type { OpeningHours } from "../types/api.types";
import dayjs, { Dayjs } from "dayjs";

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const subjectOptions = [
  { value: "general", label: "General Inquiry", icon: "💬" },
  { value: "reservation", label: "Party Reservation", icon: "🎉" },
  { value: "event", label: "Event Inquiry", icon: "🎊" },
  { value: "catering", label: "Catering Request", icon: "🍴" },
  { value: "feedback", label: "Feedback", icon: "⭐" },
  { value: "careers", label: "Careers", icon: "💼" },
  { value: "other", label: "Other", icon: "📝" },
];

const careerPositions = [
  "Server / Waitstaff",
  "Bartender",
  "Host / Hostess",
  "Line Cook",
  "Prep Cook",
  "Kitchen Manager",
  "Dishwasher",
  "Busser",
  "Manager",
  "Assistant Manager",
  "Other",
];

// ═══════════════════════════════════════════════════════════════════
// PREMIUM STYLING
// ═══════════════════════════════════════════════════════════════════

const premiumTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    fontSize: "1rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: "rgba(255,255,255,1)",
      boxShadow: "0 4px 20px rgba(217,167,86,0.15)",
    },
    "&:hover fieldset": {
      borderColor: "#D9A756",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,1)",
      boxShadow: "0 8px 32px rgba(217,167,86,0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D9A756",
      borderWidth: "2px",
    },
    "& fieldset": {
      borderColor: "rgba(217,167,86,0.3)",
      transition: "all 0.3s ease",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6A3A1E",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#D9A756",
      fontWeight: 600,
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#3C1F0E",
    fontFamily: '"Inter", sans-serif',
  },
};

const premiumPickerSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    fontSize: "1rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: "rgba(255,255,255,1)",
      boxShadow: "0 4px 20px rgba(217,167,86,0.15)",
    },
    "&:hover fieldset": {
      borderColor: "#D9A756",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      bgcolor: "rgba(255,255,255,1)",
      boxShadow: "0 8px 32px rgba(217,167,86,0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D9A756",
      borderWidth: "2px",
    },
    "& fieldset": {
      borderColor: "rgba(217,167,86,0.3)",
      transition: "all 0.3s ease",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6A3A1E",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#D9A756",
      fontWeight: 600,
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#3C1F0E",
    fontFamily: '"Inter", sans-serif',
  },
  "& .MuiIconButton-root": {
    color: "#D9A756",
  },
};

// ═══════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const ContactInfoCard = ({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    sx={{
      position: "relative",
      p: { xs: 2.5, md: 3 },
      borderRadius: "24px",
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(253,248,243,0.9) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(217,167,86,0.2)",
      boxShadow: "0 10px 40px rgba(106,58,30,0.08)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      "&:hover": {
        boxShadow: "0 20px 60px rgba(217,167,86,0.15)",
        border: "1px solid rgba(217,167,86,0.4)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #D9A756, #B08030, #D9A756)",
        opacity: 0,
        transition: "opacity 0.3s ease",
      },
      "&:hover::before": {
        opacity: 1,
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(217,167,86,0.35)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.25rem", md: "1.4rem" },
            fontWeight: 700,
            color: "#3C1F0E",
            mb: 1,
          }}
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  </Box>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

const ContactUs = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    reservationDate: "",
    reservationTime: "",
    guestCount: undefined,
    position: "",
    message: "",
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error" | "info",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isReservation = formData.subject === "reservation";
  const isCareers = formData.subject === "careers";

  // Fetch opening hours
  const { data: openingHoursData } = useApiWithCache<OpeningHours[]>(
    "opening-hours",
    () => openingHoursService.getAllOpeningHours()
  );

  // Format opening hours into condensed display
  const formatOpeningHours = (hours: OpeningHours[] | null) => {
    if (!hours || hours.length === 0) {
      return [
        { days: "SUN - THU", time: "11 A.M. - 11 P.M." },
        { days: "FRI - SAT", time: "11 A.M. - 2 A.M." },
      ];
    }

    // Group hours by time
    const timeGroups: { [key: string]: string[] } = {};
    const dayAbbrev: Record<string, string> = {
      monday: "MON",
      tuesday: "TUE",
      wednesday: "WED",
      thursday: "THU",
      friday: "FRI",
      saturday: "SAT",
      sunday: "SUN",
    };

    const dayOrder = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    hours.forEach((h) => {
      const isClosed = !h.isOpen || !h.isActive || !h.openTime || !h.closeTime;
      const timeKey = isClosed ? "Closed" : `${h.openTime} - ${h.closeTime}`;
      const day = dayAbbrev[h.dayOfWeek.toLowerCase()] || h.dayOfWeek;

      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = [];
      }
      timeGroups[timeKey].push(day);
    });

    // Convert groups to display format
    const result: { days: string; time: string }[] = [];

    Object.entries(timeGroups).forEach(([time, days]) => {
      // Sort days by day order
      days.sort((a, b) => {
        const aIdx = dayOrder.findIndex((d) => dayAbbrev[d] === a);
        const bIdx = dayOrder.findIndex((d) => dayAbbrev[d] === b);
        return aIdx - bIdx;
      });

      // Group consecutive days
      let daysStr = "";
      if (days.length === 1) {
        daysStr = days[0];
      } else if (days.length === 7) {
        daysStr = "EVERYDAY";
      } else {
        // Check if consecutive
        const indices = days.map((d) => {
          const key = Object.keys(dayAbbrev).find((k) => dayAbbrev[k] === d);
          return dayOrder.indexOf(key || "");
        });
        const isConsecutive = indices.every(
          (val, i, arr) => i === 0 || val === arr[i - 1] + 1
        );

        if (isConsecutive && days.length > 2) {
          daysStr = `${days[0]} - ${days[days.length - 1]}`;
        } else {
          daysStr = days.join(", ");
        }
      }

      // Format time to A.M./P.M. format
      let formattedTime = time;
      if (time !== "Closed") {
        formattedTime = time
          .replace(/(\d{1,2}):00\s*(AM|PM)/gi, "$1 $2")
          .replace(/AM/g, "A.M.")
          .replace(/PM/g, "P.M.");
      }

      result.push({ days: daysStr, time: formattedTime });
    });

    return result;
  };

  const displayHours = formatOpeningHours(openingHoursData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid numbers
    if (value === "") {
      setFormData({ ...formData, guestCount: undefined });
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0 && num <= 10000) {
        setFormData({ ...formData, guestCount: num });
      }
    }
    if (errors.guestCount) {
      setErrors({ ...errors, guestCount: "" });
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    setFormData({
      ...formData,
      reservationDate: newDate ? newDate.format("YYYY-MM-DD") : "",
    });
    if (errors.reservationDate) {
      setErrors({ ...errors, reservationDate: "" });
    }
  };

  const handleTimeChange = (newTime: Dayjs | null) => {
    setSelectedTime(newTime);
    setFormData({
      ...formData,
      reservationTime: newTime ? newTime.format("h:mm A") : "",
    });
    if (errors.reservationTime) {
      setErrors({ ...errors, reservationTime: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    if (isReservation) {
      if (!formData.reservationDate)
        newErrors.reservationDate = "Please select a date";
      if (!formData.reservationTime)
        newErrors.reservationTime = "Please select a time";
      if (!formData.guestCount || formData.guestCount < 1) {
        newErrors.guestCount = "Please enter number of guests (1-10000)";
      }
    }
    if (isCareers && !formData.position) {
      newErrors.position = "Please select a position";
    }
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      let fullMessage = formData.message;
      if (isReservation) {
        fullMessage = `PARTY RESERVATION REQUEST\n\nDate: ${formData.reservationDate}\nTime: ${formData.reservationTime}\nNumber of Guests: ${formData.guestCount}\n\nAdditional Notes:\n${formData.message}`;
      }
      if (isCareers) {
        fullMessage = `CAREERS APPLICATION\n\nPosition: ${formData.position}\n\nCover Letter / Message:\n${formData.message}`;
      }

      const response = await contactService.submitContactForm({
        ...formData,
        message: fullMessage,
      });

      if (response.success) {
        setSubmitted(true);
        setSnackbar({
          open: true,
          severity: "success",
          message: response.message,
        });
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            reservationDate: "",
            reservationTime: "",
            guestCount: undefined,
            position: "",
            message: "",
          });
          setSelectedDate(null);
          setSelectedTime(null);
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Contact form submission error:", err);
      const subjectLine = isReservation
        ? `Party Reservation - ${formData.reservationDate}`
        : isCareers
        ? `Careers Application - ${formData.position}`
        : subjectOptions.find((opt) => opt.value === formData.subject)?.label ||
          "Contact from website";

      let fullMessage = formData.message;
      if (isReservation) {
        fullMessage = `PARTY RESERVATION REQUEST\n\nDate: ${formData.reservationDate}\nTime: ${formData.reservationTime}\nNumber of Guests: ${formData.guestCount}\n\nAdditional Notes:\n${formData.message}`;
      }
      if (isCareers) {
        fullMessage = `CAREERS APPLICATION\n\nPosition: ${formData.position}\n\nCover Letter / Message:\n${formData.message}`;
      }

      const subject = encodeURIComponent(subjectLine);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${
          formData.phone || "N/A"
        }\n\n${fullMessage}`
      );
      window.location.href = `mailto:brooklinpub@gmail.com?subject=${subject}&body=${body}`;
      setSnackbar({
        open: true,
        severity: "info",
        message: "Opening email client as backup...",
      });
    } finally {
      setLoading(false);
    }
  };

  // Premium Success Component
  const SuccessMessage = () => (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, md: 10 },
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Celebration particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
            y: [0, -50 - i * 10],
          }}
          transition={{ duration: 1.5, delay: 0.3 + i * 0.1 }}
          sx={{
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#D9A756" : "#4CAF50",
          }}
        />
      ))}

      <Box
        component={motion.div}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          boxShadow: "0 20px 60px rgba(76, 175, 80, 0.4)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: "3px solid rgba(76, 175, 80, 0.3)",
            animation: "pulse 2s infinite",
          },
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)", opacity: 1 },
            "50%": { transform: "scale(1.1)", opacity: 0.5 },
          },
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 70, color: "#fff" }} />
      </Box>

      <Typography
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        sx={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: { xs: "2rem", md: "2.5rem" },
          fontWeight: 700,
          color: "#3C1F0E",
          mb: 2,
        }}
      >
        {isReservation
          ? "Reservation Request Sent!"
          : isCareers
          ? "Application Submitted!"
          : "Message Sent!"}
      </Typography>

      <Typography
        component={motion.p}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        sx={{
          color: "#6A3A1E",
          fontSize: "1.1rem",
          maxWidth: 450,
          lineHeight: 1.8,
          mb: 4,
        }}
      >
        {isReservation
          ? "Thank you! We'll confirm your party reservation shortly via email."
          : isCareers
          ? "Thank you for your interest! Our team will review your application and get back to you soon."
          : "Thank you for reaching out! We'll get back to you within 24 hours."}
      </Typography>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        sx={{
          p: 3,
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(217,167,86,0.1) 0%, rgba(217,167,86,0.05) 100%)",
          border: "2px solid rgba(217,167,86,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <EmailIcon sx={{ color: "#D9A756", fontSize: 28 }} />
        <Box sx={{ textAlign: "left" }}>
          <Typography sx={{ color: "#8B5A2B", fontSize: "0.85rem", mb: 0.5 }}>
            Confirmation sent to
          </Typography>
          <Typography sx={{ color: "#3C1F0E", fontWeight: 600 }}>
            {formData.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#FDF8F3",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatedBackground variant="subtle" />
        <ContactSEO />
        <Nav />
        <Callicon />
        <SocialMedia />

        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION - Using reusable component
        ═══════════════════════════════════════════════════════════════════ */}
        <HeroSection
          id="contact-hero"
          title="Contact Us"
          subtitle="Reservations, private events, or just saying hello — our door is always open"
          overlineText="Get In Touch"
          variant="light"
        />

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <Box
          sx={{
            position: "relative",
            background: "#FDF8F3",
            py: { xs: 6, md: 10 },
          }}
        >
          <MenuBackground />

          <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
            {/* Section Header */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}
            >
              <Typography
                sx={{
                  color: "#D9A756",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                ◆ Reach Out ◆
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: "2rem", md: "2.8rem" },
                  fontWeight: 700,
                  color: "#3C1F0E",
                }}
              >
                How Can We{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #D9A756, #B08030)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Help You?
                </Box>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1.3fr" },
                gap: { xs: 4, md: 6 },
                alignItems: "start",
              }}
            >
              {/* ═══════════════════════════════════════════════════════════
                  LEFT SIDE - CONTACT INFO CARDS
              ═══════════════════════════════════════════════════════════ */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Visit Us Card */}
                <ContactInfoCard
                  icon={<LocationOnIcon sx={{ fontSize: 28, color: "#fff" }} />}
                  title="Visit Us"
                  delay={0.1}
                >
                  <Typography
                    sx={{
                      color: "#4A2C17",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      "& strong": { color: "#3C1F0E" },
                    }}
                  >
                    <strong>15 Baldwin Street</strong>
                    <br />
                    Whitby, ON L1M 1A2
                    <br />
                    Canada
                  </Typography>
                  <Button
                    component={motion.a}
                    whileHover={{ x: 5 }}
                    href="https://maps.google.com/?q=15+Baldwin+Street+Whitby+ON"
                    target="_blank"
                    sx={{
                      mt: 1.5,
                      p: 0,
                      color: "#D9A756",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      minWidth: "auto",
                      "&:hover": {
                        background: "transparent",
                        color: "#B08030",
                      },
                    }}
                  >
                    Get Directions <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Button>
                </ContactInfoCard>

                {/* Contact Card */}
                <ContactInfoCard
                  icon={<PhoneIcon sx={{ fontSize: 28, color: "#fff" }} />}
                  title="Get in Touch"
                  delay={0.2}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Box
                      component={motion.a}
                      href="tel:9056553513"
                      whileHover={{ x: 5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        textDecoration: "none",
                        color: "#4A2C17",
                        transition: "color 0.3s",
                        "&:hover": { color: "#D9A756" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          bgcolor: "rgba(217,167,86,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: 18, color: "#D9A756" }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        (905) 655-3513
                      </Typography>
                    </Box>
                    <Box
                      component={motion.a}
                      href="mailto:brooklinpub@gmail.com"
                      whileHover={{ x: 5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        textDecoration: "none",
                        color: "#4A2C17",
                        transition: "color 0.3s",
                        "&:hover": { color: "#D9A756" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          bgcolor: "rgba(217,167,86,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 18, color: "#D9A756" }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        brooklinpub@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </ContactInfoCard>

                {/* Hours Card - Condensed Format */}
                <ContactInfoCard
                  icon={<AccessTimeIcon sx={{ fontSize: 28, color: "#fff" }} />}
                  title="Opening Hours"
                  delay={0.3}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {displayHours.map((h, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 0.75,
                          borderBottom:
                            idx < displayHours.length - 1
                              ? "1px solid rgba(217,167,86,0.15)"
                              : "none",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#3C1F0E",
                            fontSize: "0.9rem",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {h.days}
                        </Typography>
                        <Typography
                          sx={{
                            color: h.time === "Closed" ? "#c44" : "#6A3A1E",
                            fontWeight: h.time === "Closed" ? 600 : 500,
                            fontSize: "0.9rem",
                          }}
                        >
                          {h.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </ContactInfoCard>

                {/* Lottie Animation */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Box sx={{ width: 280, height: 220 }}>
                    <Lottie
                      animationData={contactAnimation}
                      loop
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* ═══════════════════════════════════════════════════════════
                  RIGHT SIDE - PREMIUM CONTACT FORM
              ═══════════════════════════════════════════════════════════ */}
              <Box
                id="contact-form"
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: "relative",
                  borderRadius: "32px",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(253,248,243,0.9) 100%)",
                  backdropFilter: "blur(20px)",
                  p: { xs: 3, sm: 4, md: 5 },
                  boxShadow: "0 20px 60px rgba(106,58,30,0.12)",
                  border: "1px solid rgba(217,167,86,0.2)",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background:
                      "linear-gradient(90deg, #D9A756, #B08030, #D9A756)",
                  },
                }}
              >
                {/* Decorative Corner Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    width: 80,
                    height: 80,
                    borderTop: "2px solid rgba(217,167,86,0.2)",
                    borderRight: "2px solid rgba(217,167,86,0.2)",
                    borderRadius: "0 16px 0 0",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    width: 80,
                    height: 80,
                    borderBottom: "2px solid rgba(217,167,86,0.2)",
                    borderLeft: "2px solid rgba(217,167,86,0.2)",
                    borderRadius: "0 0 0 16px",
                    pointerEvents: "none",
                  }}
                />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessMessage key="success" />
                  ) : (
                    <Box
                      component={motion.form}
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                    >
                      {/* Form Header */}
                      <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: { xs: "1.8rem", md: "2.2rem" },
                            fontWeight: 700,
                            color: "#3C1F0E",
                            mb: 1,
                          }}
                        >
                          Send Us a Message
                        </Typography>
                        <Typography
                          sx={{
                            color: "#6A3A1E",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                          }}
                        >
                          We'll get back to you within 24 hours
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.5,
                        }}
                      >
                        {/* Name Field */}
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          error={!!errors.name}
                          helperText={errors.name}
                          sx={premiumTextFieldSx}
                        />

                        {/* Email & Phone Row */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2.5,
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
                            sx={premiumTextFieldSx}
                          />
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            sx={premiumTextFieldSx}
                          />
                        </Box>

                        {/* Subject Field */}
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
                          sx={premiumTextFieldSx}
                        >
                          <MenuItem value="" disabled>
                            Select a subject
                          </MenuItem>
                          {subjectOptions.map((option) => (
                            <MenuItem
                              key={option.value}
                              value={option.value}
                              sx={{
                                py: 1.5,
                                "&:hover": { bgcolor: "rgba(217,167,86,0.1)" },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                }}
                              >
                                <span>{option.icon}</span>
                                {option.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>

                        {/* Party Reservation Fields */}
                        <AnimatePresence>
                          {isReservation && (
                            <Box
                              component={motion.div}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              sx={{
                                p: 3,
                                borderRadius: "20px",
                                background:
                                  "linear-gradient(135deg, rgba(217,167,86,0.08) 0%, rgba(217,167,86,0.03) 100%)",
                                border: "2px dashed rgba(217,167,86,0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  mb: 2.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(217,167,86,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CalendarMonthIcon
                                    sx={{ color: "#D9A756" }}
                                  />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#3C1F0E",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  Party Reservation Details
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                  },
                                  gap: 2,
                                  mb: 2,
                                }}
                              >
                                {/* Custom Date Picker */}
                                <DatePicker
                                  label="Date"
                                  value={selectedDate}
                                  onChange={handleDateChange}
                                  minDate={dayjs()}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      required: true,
                                      error: !!errors.reservationDate,
                                      helperText: errors.reservationDate,
                                    },
                                    day: {
                                      sx: {
                                        "&.Mui-selected": {
                                          bgcolor: "#D9A756",
                                          "&:hover": { bgcolor: "#B08030" },
                                        },
                                      },
                                    },
                                  }}
                                  sx={premiumPickerSx}
                                />

                                {/* Custom Time Picker */}
                                <TimePicker
                                  label="Time"
                                  value={selectedTime}
                                  onChange={handleTimeChange}
                                  minTime={dayjs().hour(11).minute(0)}
                                  maxTime={dayjs().hour(22).minute(0)}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      required: true,
                                      error: !!errors.reservationTime,
                                      helperText: errors.reservationTime,
                                    },
                                  }}
                                  sx={premiumPickerSx}
                                />
                              </Box>

                              {/* Guest Count - Typed Input */}
                              <TextField
                                fullWidth
                                type="number"
                                label="Number of Guests"
                                name="guestCount"
                                value={formData.guestCount ?? ""}
                                onChange={handleGuestCountChange}
                                required
                                error={!!errors.guestCount}
                                helperText={errors.guestCount}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <GroupIcon sx={{ color: "#D9A756" }} />
                                    </InputAdornment>
                                  ),
                                  inputProps: { min: 1, max: 10000 },
                                }}
                                sx={premiumTextFieldSx}
                              />
                            </Box>
                          )}
                        </AnimatePresence>

                        {/* Careers Fields */}
                        <AnimatePresence>
                          {isCareers && (
                            <Box
                              component={motion.div}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              sx={{
                                p: 3,
                                borderRadius: "20px",
                                background:
                                  "linear-gradient(135deg, rgba(217,167,86,0.08) 0%, rgba(217,167,86,0.03) 100%)",
                                border: "2px dashed rgba(217,167,86,0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1.5,
                                  mb: 2.5,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "12px",
                                    bgcolor: "rgba(217,167,86,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <WorkIcon sx={{ color: "#D9A756" }} />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#3C1F0E",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  Careers Application
                                </Typography>
                              </Box>

                              <TextField
                                select
                                fullWidth
                                label="Position Applying For"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                error={!!errors.position}
                                helperText={
                                  errors.position ||
                                  "Select the position you're interested in"
                                }
                                sx={premiumTextFieldSx}
                              >
                                <MenuItem value="" disabled>
                                  Select a position
                                </MenuItem>
                                {careerPositions.map((pos) => (
                                  <MenuItem
                                    key={pos}
                                    value={pos}
                                    sx={{
                                      py: 1.5,
                                      "&:hover": {
                                        bgcolor: "rgba(217,167,86,0.1)",
                                      },
                                    }}
                                  >
                                    {pos}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Box>
                          )}
                        </AnimatePresence>

                        {/* Message Field */}
                        <TextField
                          fullWidth
                          label={
                            isReservation
                              ? "Special Requests / Notes"
                              : isCareers
                              ? "Cover Letter / Why you want to join us"
                              : "Your Message"
                          }
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          multiline
                          rows={isReservation ? 3 : isCareers ? 5 : 5}
                          placeholder={
                            isReservation
                              ? "Any dietary restrictions, special occasions, seating preferences..."
                              : isCareers
                              ? "Tell us about yourself, your experience, and why you'd be a great fit for Brooklin Pub..."
                              : "Tell us how we can help you..."
                          }
                          error={!!errors.message}
                          helperText={errors.message}
                          sx={premiumTextFieldSx}
                        />

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          component={motion.button}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          sx={{
                            mt: 1,
                            py: 2,
                            borderRadius: "16px",
                            background:
                              "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                            color: "#FFFDFB",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            fontFamily: '"Inter", sans-serif',
                            textTransform: "none",
                            boxShadow: "0 10px 30px rgba(217,167,86,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #E5B566 0%, #C49040 100%)",
                              boxShadow: "0 15px 40px rgba(217,167,86,0.5)",
                            },
                            "&:disabled": {
                              background: "rgba(217,167,86,0.5)",
                              color: "#fff",
                            },
                          }}
                        >
                          {loading ? (
                            <CircularProgress
                              size={26}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            <>
                              <SendIcon sx={{ fontSize: 22 }} />
                              {isReservation
                                ? "Request Reservation"
                                : isCareers
                                ? "Submit Application"
                                : "Send Message"}
                            </>
                          )}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            </Box>

            {/* ═══════════════════════════════════════════════════════════════
                MAP SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              sx={{ mt: { xs: 6, md: 10 } }}
            >
              {/* Map Header */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  sx={{
                    color: "#D9A756",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  ◆ Find Us ◆
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    fontWeight: 700,
                    color: "#3C1F0E",
                  }}
                >
                  Visit Our Location
                </Typography>
              </Box>

              {/* Map Container */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "32px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(106,58,30,0.15)",
                  height: { xs: 300, sm: 400, md: 500 },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    border: "4px solid rgba(217,167,86,0.4)",
                    borderRadius: "32px",
                    pointerEvents: "none",
                    zIndex: 2,
                  },
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
            </Box>
          </Container>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: "16px",
              fontWeight: 600,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Footer />
      </Box>
    </LocalizationProvider>
  );
};

export default ContactUs;
