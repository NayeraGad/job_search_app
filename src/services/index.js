import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, attachments, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Job Search App ✉️" <${process.env.EMAIL}>`,
    to: to || "nayera.mohamed9876@gmail.com",
    subject: subject || "Welcome to Job Search App",
    html: html || undefined,
    text: text || undefined,
    attachments: attachments || [],
  });

  if (info.accepted.length) {
    return true;
  }

  return false;
};

export default sendEmail;
