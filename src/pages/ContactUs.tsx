import { useState } from "react";
import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import InitialPage from "../components/home/InitialPage";
import Callicon from "../components/icons/CalendarIcon";
import SocialMedia from "../components/common/SocialFloatingMenu";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert("Message sent!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <Nav />
      <Callicon />
      <SocialMedia />
      <InitialPage
        line1="Get in touch"
        line2="We'd love to hear from you — bookings, events, or feedback."
      />
      <Box
        sx={{
          width: "100%",
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4, md: 8 },
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          {/* Contact Info */}
          <Box>
            <Card sx={{ height: "100%", borderRadius: 3 }} elevation={4}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
                  Contact Us
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  We usually respond within one business day.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  <Typography fontWeight={600}>Address</Typography>
                  <Typography color="text.secondary">
                    15 Baldwin St, Whitby, ON L1M 1A2
                  </Typography>
                  <Typography fontWeight={600} sx={{ mt: 2 }}>
                    Phone
                  </Typography>
                  <Typography color="text.secondary">
                    +1 905-425-3055
                  </Typography>
                  <Typography fontWeight={600} sx={{ mt: 2 }}>
                    Email
                  </Typography>
                  <Typography color="text.secondary">
                    brooklinpub@gmail.com
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href="tel:+19054253055"
                  sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
                >
                  Call us
                </Button>
              </CardActions>
            </Card>
          </Box>

          {/* Contact Form */}
          <Box>
            <Paper
              elevation={4}
              sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Send us a message
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Fill out the form and we’ll get back to you shortly.
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Message"
                  name="message"
                  multiline
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
                />
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1.2, borderRadius: 2 }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Map */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Find us on the map
          </Typography>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box
              component="iframe"
              title="Brooklin Pub & Grill Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2872.160838886545!2d-78.95788752367431!3d43.95952413277433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d51c5405c5e9a7%3A0x9d6a9df1fb4f5b1!2s15%20Baldwin%20St%2C%20Whitby%2C%20ON%20L1M%201A2%2C%20Canada!5e0!3m2!1sen!2s!4v1731139200000"
              sx={{
                border: 0,
                width: "100%",
                height: { xs: 300, sm: 380, md: 460 },
                display: "block",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Paper>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default ContactUs;
