import React, { useState } from 'react';
import Nav from './nav';
import Footer from './footer';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <Nav />
      <Box sx={{ width: '100%', minHeight: '80vh', py: 5, px: { xs: 2, sm: 5, md: 10 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: '100%', maxWidth: '100%' }}>
          <Typography variant="h4" gutterBottom align="center">
            Contact Us
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send Message
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </div>
  );
};

export default Contactus;
