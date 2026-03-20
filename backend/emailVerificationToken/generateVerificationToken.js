import crypto from 'crypto';

export const generateVerificationToken = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return otp.toString();
};