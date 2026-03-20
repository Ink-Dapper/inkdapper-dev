import { generateVerificationToken } from '../emailVerificationToken/generateVerificationToken.js';
import { saveVerificationToken, getVerificationToken } from '../emailVerificationToken/saveVerificationToken.js';
import { sendVerificationEmail } from '../emailVerificationToken/sendVerificationEmail.js';
import User from '../models/userModel.js'; // Assuming you have a User model

const verificationEmail = async (req, res) => {
  const { email } = req.body;

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ success: false, message: 'Email is already registered' });
  }

  // Generate a verification token (6-digit OTP)
  const verificationToken = generateVerificationToken();
  // Save the token to the database or in-memory store associated with the email
  await saveVerificationToken(email, verificationToken);
  // Send email logic here
  const emailSent = await sendVerificationEmail(email, verificationToken);
  if (emailSent) {
    res.json({ success: true, message: 'Verification email sent' });
  } else {
    res.json({ success: false, message: 'Failed to send verification email' });
  }
};

const verifyEmail = async (req, res) => {
  const { token, email } = req.body;
  const savedToken = await getVerificationToken(email);
  if (savedToken === token) {
    res.json({ success: true, message: 'Email verified' });
  } else {
    res.json({ success: false, message: 'Invalid token' });
  }
};

export { verificationEmail, verifyEmail };