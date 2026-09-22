require("dotenv").config();
const nodemailer = require("nodemailer");

const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "Email configuration is incomplete. Please define EMAIL_HOST, EMAIL_USER, EMAIL_PASS in your .env file."
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter verification failed:", error.message);
      return;
    }

    console.log("Email transporter is ready");
  });

  return {
    transporter,
    from: EMAIL_FROM || EMAIL_USER,
  };
};

module.exports = {
  createTransporter,
  emailConfig: createTransporter(),
};
