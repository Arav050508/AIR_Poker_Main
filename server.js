const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Fallback: always return index.html (for root and unknown routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- EMAIL ROUTE (leave this as-is) ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // move to env variables!
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