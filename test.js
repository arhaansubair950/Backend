const nodemailer = require('nodemailer');
require('dotenv').config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET ✅" : "NOT SET ❌");

nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
}).sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'FlowTask Test',
  text: 'Email is working!'
}).then(() => {
  console.log('EMAIL WORKS ✅');
}).catch((err) => {
  console.log('EMAIL FAILED ❌:', err.message);
});