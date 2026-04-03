const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  const info = await transporter.sendMail({
    from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
    to: email,
    subject: title,
    html: body,
  });

  return info;
};

module.exports = mailSender;
