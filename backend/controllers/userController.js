import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone) {
      return res.json({ success: false, message: "Email or phone is required" });
    }

    // Check if the input is an email or phone number
    const isEmail = validator.isEmail(emailOrPhone);
    const user = isEmail
      ? await userModel.findOne({ email: emailOrPhone })
      : await userModel.findOne({ phone: emailOrPhone });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user profile
const profileUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const users = await userModel.findById(userId);
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Checking user already exists or not
    const exists = await userModel.findOne({ email, phone });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const checkPhone = async (req, res) => {
  const { phone } = req.body;
  const existingUser = await userModel.findOne({ phone });
  if (existingUser) {
    return res.json({
      success: false,
      message: "Phone number is already registered",
    });
  }
  res.json({ success: true, message: "Phone number is available" });
};

// Route for user list
const usersList = async (req, res) => {
  try {
    const userData = await userModel.find({});
    const userIds = userData.map(user => user._id);

    const counts = await Promise.all(userIds.map(async userId => {
      const count = await orderModel.countDocuments({ userId, returnOrderStatus: 'Return Confirmed' });
      return { userId, count };
    }));

    const countsOne = await Promise.all(userIds.map(async userId => {
      const countCancel = await orderModel.countDocuments({ userId, returnOrderStatus: "Cancel Confirmed" });
      return { userId, countCancel };
    }));

    // Merge userData and counts
    const mergedData = userData.map(user => {
      const countData = counts.find(count => count.userId.equals(user._id));
      const countDataOne = countsOne.find(countCancel => countCancel.userId.equals(user._id));
      return {
        ...user._doc,
        returnOrderCount: countData ? countData.count : 0,
        cancelOrderCount: countDataOne ? countDataOne.countCancel : 0
      };
    });

    res.json({ success: true, message: "Users Listed", userList: mergedData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const resetCode = generateResetCode();
    const resetCodeExpiry = Date.now() + 3600000; // Code expires in 1 hour

    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    await sendEmail(email, 'Password Reset Code', `Your password reset code is ${resetCode}`);

    res.json({ success: true, message: 'Reset code sent to your email.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    console.log(`Stored reset code: ${user.resetCode}`);
    console.log(`Provided reset code: ${code}`);
    console.log(`Current time: ${Date.now()}`);
    console.log(`Reset code expiry time: ${user.resetCodeExpiry}`);

    if (user.resetCode !== code || user.resetCodeExpiry < Date.now()) {
      return res.json({ success: false, message: 'Invalid or expired reset code' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset.' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, profileUser, checkPhone, usersList, sendResetCode, resetPassword };
