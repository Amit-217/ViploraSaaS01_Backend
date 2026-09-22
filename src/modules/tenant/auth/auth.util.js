const { createTransporter } = require('../../../config/email.config');

const sendOtpEmail = async ({ email, otp, purpose, firstName = '' }) => {
  const configuredEmail = createTransporter();

  if (!configuredEmail || !configuredEmail.transporter) {
    return false;
  }

  const appName = process.env.APP_NAME || 'Viplora';
  const subject = `${appName} - ${purpose}`;
  const text = [
    `Hello ${firstName || 'there'},`,
    '',
    `Your OTP for ${purpose} is: ${otp}`,
    `This code expires in 10 minutes.`,
    'Do not share this OTP with anyone.',
    '',
    'If you did not request this, please ignore this email.',
  ].join('\n');

  await configuredEmail.transporter.sendMail({
    from: configuredEmail.from,
    to: email,
    subject,
    text,
  });

  return true;
};

const sendEmailVerificationOTP = async ({ email, otp, purpose = 'email verification' }) =>
  sendOtpEmail({ email, otp, purpose });

const sendPasswordResetOTP = async ({ email, otp }) =>
  sendOtpEmail({ email, otp, purpose: 'password reset' });

module.exports = {
  sendOtpEmail,
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
};
