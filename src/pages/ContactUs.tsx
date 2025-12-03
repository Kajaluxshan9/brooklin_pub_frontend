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
  { value: "general", label: "General Inquiry" },
  { value: "reservation", label: "Party Reservation" },
  { value: "event", label: "Event Inquiry" },
  { value: "catering", label: "Catering Request" },
  { value: "feedback", label: "Feedback" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Other" },
];

// Career positions removed - now using CV upload instead

// ═══════════════════════════════════════════════════════════════════
// PREMIUM STYLING
// ═══════════════════════════════════════════════════════════════════

const premiumTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    fontSize: { xs: "16px", md: "1rem" }, // 16px prevents iOS zoom on focus
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    minHeight: { xs: 56, md: "auto" }, // Larger touch target on mobile
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
    fontSize: { xs: "16px", md: "1rem" }, // 16px prevents iOS zoom
    py: { xs: 2, md: 1.5 }, // Better touch area
  },
};

const premiumPickerSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    fontSize: { xs: "16px", md: "1rem" }, // 16px prevents iOS zoom on focus
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    minHeight: { xs: 56, md: "auto" }, // Larger touch target on mobile
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
    fontSize: { xs: "16px", md: "1rem" }, // 16px prevents iOS zoom
    py: { xs: 2, md: 1.5 }, // Better touch area
  },
  "& .MuiIconButton-root": {
    color: "#D9A756",
    minWidth: 48, // Touch-friendly
    minHeight: 48,
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
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -3, scale: 1.01 }}
    sx={{
      position: "relative",
      p: { xs: 2, sm: 2.5, md: 3 },
      borderRadius: { xs: "16px", sm: "20px", md: "24px" },
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(253,248,243,0.95) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(217,167,86,0.2)",
      boxShadow: "0 8px 32px rgba(106,58,30,0.08)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      width: "100%",
      "&:hover": {
        boxShadow: "0 16px 48px rgba(217,167,86,0.15)",
        border: "1px solid rgba(217,167,86,0.35)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #D9A756, #B08030, #D9A756)",
        opacity: 0,
        transition: "opacity 0.3s ease",
      },
      "&:hover::before": {
        opacity: 1,
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 1.5, sm: 2, md: 2 },
      }}
    >
      <Box
        sx={{
          width: { xs: 44, sm: 48, md: 56 },
          height: { xs: 44, sm: 48, md: 56 },
          borderRadius: { xs: "12px", md: "16px" },
          background: "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(217,167,86,0.35)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.4rem" },
            fontWeight: 700,
            color: "#3C1F0E",
            mb: 0.75,
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
    cvFile: undefined,
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

    // Helper function to convert 24-hour time to 12-hour A.M./P.M. format
    const formatTimeTo12Hour = (time: string): string => {
      // Handle formats like "11:00:00", "11:00", "23:00:00", "23:00"
      const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (!match) return time;

      let hour = parseInt(match[1], 10);
      const minutes = match[2];

      const period = hour >= 12 ? "P.M." : "A.M.";

      // Convert to 12-hour format
      if (hour === 0) {
        hour = 12;
      } else if (hour > 12) {
        hour = hour - 12;
      }

      // Only show minutes if they're not :00
      if (minutes === "00") {
        return `${hour} ${period}`;
      }
      return `${hour}:${minutes} ${period}`;
    };

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

        if (isConsecutive && days.length >= 2) {
          daysStr = `${days[0]} - ${days[days.length - 1]}`;
        } else {
          daysStr = days.join(" - ");
        }
      }

      // Format time to A.M./P.M. format
      let formattedTime = time;
      if (time !== "Closed") {
        // Split by " - " to handle both times
        const timeParts = time.split(" - ");
        if (timeParts.length === 2) {
          const openFormatted = formatTimeTo12Hour(timeParts[0].trim());
          const closeFormatted = formatTimeTo12Hour(timeParts[1].trim());
          formattedTime = `${openFormatted} - ${closeFormatted}`;
        }
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
      // Guest count is optional - only validate if provided
      if (formData.guestCount !== undefined && formData.guestCount < 1) {
        newErrors.guestCount = "Number of guests must be at least 1";
      }
    }
    if (isCareers) {
      // CV file is optional but validate if provided
      if (formData.cvFile) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (formData.cvFile.size > maxSize) {
          newErrors.cvFile = "File size must be less than 5MB";
        } else if (!allowedTypes.includes(formData.cvFile.type)) {
          newErrors.cvFile = "Please upload a PDF, DOC, or DOCX file";
        }
      }
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
            cvFile: undefined,
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
        ? `Careers Application`
        : subjectOptions.find((opt) => opt.value === formData.subject)?.label ||
          "Contact from website";

      let fullMessage = formData.message;
      if (isReservation) {
        fullMessage = `PARTY RESERVATION REQUEST\n\nDate: ${formData.reservationDate}\nTime: ${formData.reservationTime}\nNumber of Guests: ${formData.guestCount}\n\nAdditional Notes:\n${formData.message}`;
      }
      if (isCareers) {
        fullMessage = `CAREERS APPLICATION\n\nCover Letter / Message:\n${
          formData.message
        }${
          formData.cvFile
            ? "\n\n[CV Attached: " + formData.cvFile.name + "]"
            : ""
        }`;
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
          overflowX: "hidden",
          width: "100%",
          maxWidth: "100vw",
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
            py: { xs: 4, sm: 6, md: 10 },
            px: { xs: 0, sm: 0 },
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          <MenuBackground />

          <Container
            maxWidth="xl"
            sx={{
              position: "relative",
              zIndex: 2,
              px: { xs: 1.5, sm: 2, md: 4 },
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {/* Section Header */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              sx={{
                textAlign: "center",
                mb: { xs: 3, sm: 4, md: 8 },
                px: { xs: 1, sm: 0 },
              }}
            >
              <Typography
                sx={{
                  color: "#D9A756",
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  fontWeight: 600,
                  letterSpacing: { xs: "0.2em", sm: "0.3em" },
                  textTransform: "uppercase",
                  mb: { xs: 1.5, md: 2 },
                }}
              >
                ◆ Your Table's Waiting ◆
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: { xs: "1.6rem", sm: "2rem", md: "2.8rem" },
                  fontWeight: 700,
                  color: "#3C1F0E",
                  mb: { xs: 1.5, md: 2 },
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
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
              <Typography
                sx={{
                  color: "#6A3A1E",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.85,
                  letterSpacing: "0.01em",
                  maxWidth: "600px",
                  mx: "auto",
                  fontFamily: '"Inter", sans-serif',
                  px: { xs: 0.5, sm: 0 },
                }}
              >
                From reservations to private events, feedback to career
                opportunities — our door is always open. Where every stranger's
                a friend you haven't met.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: { xs: 2.5, sm: 3, md: 6 },
                alignItems: "stretch",
                width: "100%",
              }}
            >
              {/* ═══════════════════════════════════════════════════════════
                  LEFT SIDE - CONTACT INFO CARDS
              ═══════════════════════════════════════════════════════════ */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, sm: 3 },
                  width: "100%",
                  flex: { lg: "0 0 42%" },
                }}
              >
                {/* Visit Us Card */}
                <ContactInfoCard
                  icon={
                    <LocationOnIcon
                      sx={{
                        fontSize: { xs: 24, sm: 26, md: 28 },
                        color: "#fff",
                      }}
                    />
                  }
                  title="Visit Us"
                  delay={0.1}
                >
                  <Typography
                    sx={{
                      color: "#4A2C17",
                      fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
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
                      fontSize: { xs: "0.85rem", sm: "0.9rem" },
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
                    Get Directions{" "}
                    <ArrowForwardIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                  </Button>
                </ContactInfoCard>
                

                {/* Contact Card */}
                <ContactInfoCard
                  icon={
                    <PhoneIcon
                      sx={{
                        fontSize: { xs: 24, sm: 26, md: 28 },
                        color: "#fff",
                      }}
                    />
                  }
                  title="Get in Touch"
                  delay={0.2}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 1.5, sm: 2, md: 1.5 },
                    }}
                  >
                    <Box
                      component={motion.a}
                      href="tel:9056553513"
                      whileHover={{ x: 5 }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 1.5 },
                        textDecoration: "none",
                        color: "#4A2C17",
                        transition: "color 0.3s",
                        py: { xs: 0.5, md: 0 },
                        "&:hover": { color: "#D9A756" },
                        "&:active": { color: "#B08030" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 36 },
                          height: { xs: 36, sm: 40, md: 36 },
                          borderRadius: { xs: "10px", md: "10px" },
                          bgcolor: "rgba(217,167,86,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <PhoneIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20, md: 18 },
                            color: "#D9A756",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                        }}
                      >
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
                        gap: { xs: 1, sm: 1.5 },
                        textDecoration: "none",
                        color: "#4A2C17",
                        transition: "color 0.3s",
                        py: { xs: 0.5, md: 0 },
                        "&:hover": { color: "#D9A756" },
                        "&:active": { color: "#B08030" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 36, sm: 40, md: 36 },
                          height: { xs: 36, sm: 40, md: 36 },
                          borderRadius: { xs: "10px", md: "10px" },
                          bgcolor: "rgba(217,167,86,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <EmailIcon
                          sx={{
                            fontSize: { xs: 18, sm: 20, md: 18 },
                            color: "#D9A756",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: {
                            xs: "0.85rem",
                            sm: "0.95rem",
                            md: "1rem",
                          },
                          wordBreak: "break-word",
                        }}
                      >
                        brooklinpub@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </ContactInfoCard>

                {/* Hours Card - Condensed Format */}
                <ContactInfoCard
                  icon={
                    <AccessTimeIcon
                      sx={{
                        fontSize: { xs: 24, sm: 26, md: 28 },
                        color: "#fff",
                      }}
                    />
                  }
                  title="Opening Hours"
                  delay={0.3}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: { xs: 0.5, sm: 1 },
                    }}
                  >
                    {displayHours.map((h, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: { xs: 0.5, sm: 0.75 },
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
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                            letterSpacing: "0.05em",
                          }}
                        >
                          {h.days}
                        </Typography>
                        <Typography
                          sx={{
                            color: h.time === "Closed" ? "#c44" : "#6A3A1E",
                            fontWeight: h.time === "Closed" ? 600 : 500,
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                          }}
                        >
                          {h.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </ContactInfoCard>

                {/* Lottie animation removed from left column — moved beside form header */}
              </Box>

              {/* ═══════════════════════════════════════════════════════════
                  RIGHT SIDE - PREMIUM CONTACT FORM
              ═══════════════════════════════════════════════════════════ */}
              <Box
                id="contact-form"
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: "relative",
                  borderRadius: { xs: "16px", sm: "24px", md: "32px" },
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(253,248,243,0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  p: { xs: 2, sm: 3, md: 5 },
                  boxShadow: "0 20px 60px rgba(106,58,30,0.12)",
                  border: "1px solid rgba(217,167,86,0.25)",
                  overflow: "hidden",
                  width: "100%",
                  flex: { lg: 1 },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: { xs: "4px", md: "5px" },
                    background:
                      "linear-gradient(90deg, #D9A756, #B08030, #D9A756)",
                  },
                }}
              >
                {/* Decorative Corner Elements - Hidden on mobile */}
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
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
                    display: { xs: "none", sm: "block" },
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
                      {/* Form Header with chef Lottie on both sides */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mb: { xs: 2.5, sm: 3, md: 4 },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 120, sm: 56, md: 72 },
                              height: { xs: 120, sm: 56, md: 72 },
                              display: "block",
                            }}
                          >
                            <Lottie
                              animationData={contactAnimation}
                              loop
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Box>

                          <Box sx={{ textAlign: "center", maxWidth: 520 }}>
                            <Typography
                              sx={{
                                fontFamily:
                                  '"Cormorant Garamond", Georgia, serif',
                                fontSize: {
                                  xs: "1.35rem",
                                  sm: "1.6rem",
                                  md: "2.2rem",
                                },
                                fontWeight: 700,
                                color: "#3C1F0E",
                                mb: { xs: 1, md: 1.5 },
                              }}
                            >
                              Let's Talk
                            </Typography>
                            <Typography
                              sx={{
                                color: "#6A3A1E",
                                fontSize: {
                                  xs: "0.85rem",
                                  sm: "0.9rem",
                                  md: "1rem",
                                },
                                lineHeight: 1.6,
                                mb: { xs: 1.5, md: 2 },
                              }}
                            >
                              We'd love to hear from you! Whether you're
                              planning a visit, looking to join our team, or
                              just want to say hi — drop us a line.
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: { xs: 48, sm: 56, md: 72 },
                              height: { xs: 48, sm: 56, md: 72 },
                              display: { xs: "none", sm: "block" },
                            }}
                          >
                            <Lottie
                              animationData={contactAnimation}
                              loop
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: { xs: 0.75, md: 1 },
                            px: { xs: 1.5, md: 2.5 },
                            py: { xs: 0.75, md: 1 },
                            borderRadius: "20px",
                            background: "rgba(217,167,86,0.1)",
                            border: "1px solid rgba(217,167,86,0.25)",
                            mt: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 6, md: 8 },
                              height: { xs: 6, md: 8 },
                              borderRadius: "50%",
                              background: "#22C55E",
                              animation: "pulse 2s infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.5 },
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              color: "#6A3A1E",
                              fontSize: {
                                xs: "0.75rem",
                                sm: "0.8rem",
                                md: "0.85rem",
                              },
                              fontWeight: 600,
                            }}
                          >
                            We typically respond within 48 hours
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: 2, sm: 2.5 },
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
                            gap: { xs: 2, sm: 2.5 },
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
                                p: { xs: 2, sm: 2.5, md: 3 },
                                borderRadius: { xs: "14px", md: "20px" },
                                background:
                                  "linear-gradient(135deg, rgba(217,167,86,0.08) 0%, rgba(217,167,86,0.03) 100%)",
                                border: "2px dashed rgba(217,167,86,0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: { xs: 1, md: 1.5 },
                                  mb: { xs: 2, md: 2.5 },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: { xs: 36, md: 40 },
                                    height: { xs: 36, md: 40 },
                                    borderRadius: { xs: "10px", md: "12px" },
                                    bgcolor: "rgba(217,167,86,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CalendarMonthIcon
                                    sx={{
                                      color: "#D9A756",
                                      fontSize: { xs: 20, md: 24 },
                                    }}
                                  />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#3C1F0E",
                                    fontSize: { xs: "0.95rem", md: "1.1rem" },
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
                                  gap: { xs: 1.5, md: 2 },
                                  mb: { xs: 1.5, md: 2 },
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

                        {/* Careers Fields - CV Upload */}
                        <AnimatePresence>
                          {isCareers && (
                            <Box
                              component={motion.div}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              sx={{
                                p: { xs: 2, sm: 2.5, md: 3 },
                                borderRadius: { xs: "14px", md: "20px" },
                                background:
                                  "linear-gradient(135deg, rgba(217,167,86,0.08) 0%, rgba(217,167,86,0.03) 100%)",
                                border: "2px dashed rgba(217,167,86,0.3)",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: { xs: 1, md: 1.5 },
                                  mb: { xs: 2, md: 2.5 },
                                }}
                              >
                                <Box
                                  sx={{
                                    width: { xs: 36, md: 40 },
                                    height: { xs: 36, md: 40 },
                                    borderRadius: { xs: "10px", md: "12px" },
                                    bgcolor: "rgba(217,167,86,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <WorkIcon
                                    sx={{
                                      color: "#D9A756",
                                      fontSize: { xs: 20, md: 24 },
                                    }}
                                  />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: "#3C1F0E",
                                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                                  }}
                                >
                                  Upload Your CV
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  border: "2px dashed rgba(217,167,86,0.4)",
                                  borderRadius: { xs: "12px", md: "16px" },
                                  p: { xs: 2.5, md: 3 },
                                  textAlign: "center",
                                  bgcolor: "rgba(255,255,255,0.5)",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    borderColor: "#D9A756",
                                    bgcolor: "rgba(217,167,86,0.05)",
                                  },
                                }}
                                onClick={() =>
                                  document.getElementById("cv-upload")?.click()
                                }
                              >
                                <input
                                  type="file"
                                  id="cv-upload"
                                  name="cvFile"
                                  accept=".pdf,.doc,.docx"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setFormData({
                                        ...formData,
                                        cvFile: file,
                                      });
                                    }
                                  }}
                                />
                                {formData.cvFile ? (
                                  <Box>
                                    <Typography
                                      sx={{
                                        color: "#4CAF50",
                                        fontWeight: 600,
                                        mb: 1,
                                      }}
                                    >
                                      ✓ {formData.cvFile.name}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#6A3A1E",
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      Click to change file
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box>
                                    <Typography
                                      sx={{
                                        color: "#D9A756",
                                        fontSize: "2rem",
                                        mb: 1,
                                      }}
                                    >
                                      📄
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#3C1F0E",
                                        fontWeight: 600,
                                        mb: 0.5,
                                      }}
                                    >
                                      Click to upload your CV
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#6A3A1E",
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      PDF, DOC, or DOCX (Max 5MB)
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              {errors.cvFile && (
                                <Typography
                                  sx={{
                                    color: "#d32f2f",
                                    fontSize: "0.75rem",
                                    mt: 1,
                                    ml: 2,
                                  }}
                                >
                                  {errors.cvFile}
                                </Typography>
                              )}
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
                            py: { xs: 2.25, md: 2 },
                            px: { xs: 3, md: 4 },
                            width: "auto",
                            alignSelf: "center",
                            borderRadius: "16px",
                            background:
                              "linear-gradient(135deg, #D9A756 0%, #B08030 100%)",
                            color: "#FFFDFB",
                            fontSize: { xs: "1.05rem", md: "1.1rem" },
                            fontWeight: 700,
                            fontFamily: '"Inter", sans-serif',
                            textTransform: "none",
                            boxShadow: "0 10px 30px rgba(217,167,86,0.4)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            transition: "all 0.3s ease",
                            minHeight: { xs: 56, md: "auto" }, // Touch-friendly height
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
              sx={{ mt: { xs: 4, sm: 6, md: 10 } }}
            >
              {/* Map Header */}
              <Box sx={{ textAlign: "center", mb: { xs: 2.5, md: 4 } }}>
                <Typography
                  sx={{
                    color: "#D9A756",
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    fontWeight: 600,
                    letterSpacing: { xs: "0.2em", md: "0.3em" },
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  ◆ Find Us ◆
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                    fontWeight: 700,
                    color: "#3C1F0E",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Visit Our Location
                </Typography>
              </Box>

              {/* Map Container */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: { xs: "16px", sm: "24px", md: "32px" },
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(106,58,30,0.15)",
                  height: { xs: 280, sm: 350, md: 500 },
                  mx: { xs: -0.5, sm: 0 },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    border: {
                      xs: "2px solid rgba(217,167,86,0.4)",
                      md: "4px solid rgba(217,167,86,0.4)",
                    },
                    borderRadius: { xs: "16px", sm: "24px", md: "32px" },
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
          sx={{
            bottom: { xs: "calc(80px + env(safe-area-inset-bottom))", md: 24 }, // Clear bottom nav on mobile
          }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: "16px",
              fontWeight: 600,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              mx: { xs: 2, md: 0 },
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
