import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { uploadFile, deleteFile } from "../services/storageService.js";

const createToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
  return jwt.sign({ id }, jwtSecret);
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
      
      res.json({ 
        success: true, 
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
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
    const userId = req.userId;
    const users = await userModel.findById(userId);
    
    if (!users) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
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

    // Validating email format & strong password first (fast checks before DB)
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Check email and phone separately with OR so either duplicate is caught
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "Email is already registered" });
    }

    const existingPhone = await userModel.findOne({ phone });
    if (existingPhone) {
      return res.json({ success: false, message: "Phone number is already registered" });
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
    // Handle MongoDB duplicate key error (race condition fallback)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return res.json({ success: false, message: `${field === "email" ? "Email" : "Phone number"} is already registered` });
    }
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use default values if environment variables are not set
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@inkdapper.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';

    if (
      email === adminEmail &&
      password === adminPassword
    ) {
      const token = jwt.sign(email + password, jwtSecret);
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
  try {
    const { phone } = req.body;
    const existingUser = await userModel.findOne({ phone });
    if (existingUser) {
      return res.json({ success: false, message: "Phone number is already registered" });
    }
    res.json({ success: true, message: "Phone number is available" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
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

// Route for updating user profile (name, phone, avatar)
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: 'Name is required' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates = { name: name.trim() };
    if (phone) updates.phone = phone;

    // If a new avatar file was uploaded, push it to MinIO and delete the old one
    if (req.file) {
      if (user.avatar) {
        await deleteFile(user.avatar);
      }
      const avatarUrl = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'profile'
      );
      updates.avatar = avatarUrl;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });

    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, profileUser, checkPhone, usersList, sendResetCode, resetPassword, updateProfile };
