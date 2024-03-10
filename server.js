const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: "*"}));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: '65011212154@msu.ac.th',
        pass: 'gvhb yccp satf oult'
    },
});

app.post('/send-email', async (req, res) => {
  try {
    const { recipient, subject, content } = req.body;

    const info = await transporter.sendMail({
      from: '"Facemash ProJDev." <65011212154@msu.ac.th>',
      to: recipient,
      subject,
      html: content,
    });

    console.log("Email sent:", info.response);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});