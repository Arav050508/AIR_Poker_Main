const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.resolve('./public')));

// Routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/app_index.html'));
});

app.get('/poker', (req, res) => {
  res.sendFile(path.resolve('./public/poker_index.html'));
});

app.get('/journal', (req, res) => {
  res.sendFile(path.resolve('./public/journal.html'));
});

// ---- EMAIL ROUTE ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Us: Message from ${name} <${email}>`,
      text: `Message from: ${name} <${email}>\n\n${message}`,
      replyTo: email
    });
    res.json({ success: true, info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));