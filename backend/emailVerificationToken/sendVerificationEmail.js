import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Log environment variables to verify they are loaded correctlyyy
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Create a professional HTML template for the email
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #f5f5f5;
        }
        .content {
          padding: 30px 0;
        }
        .token-box {
          background-color: #f7f7f9;
          border: 1px solid #e1e1e1;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 2px solid #f5f5f5;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Ink Dapper</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for subscribing to Ink Dapper! To complete your subscription, please use the verification code below:</p>
          
          <div class="token-box">
            ${token}
          </div>
          
          <p>This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
          
          <p>Best regards,<br>The Ink Dapper Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Ink Dapper. All rights reserved.</p>
          <p>417 Fashion Avenue, Style District, New York</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Ink Dapper" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code - Ink Dapper",
    text: `Your verification code is: ${token}. This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Add a new function for subscription confirmation emails
export const sendSubscriptionConfirmation = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Ink Dapper</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #f5f5f5;
        }
        .content {
          padding: 30px 0;
        }
        .promo {
          background-color: #f0f7ff;
          border: 1px solid #d1e6ff;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .promo-code {
          font-size: 22px;
          font-weight: bold;
          color: #0066cc;
          letter-spacing: 2px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 2px solid #f5f5f5;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Ink Dapper!</h2>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for joining our newsletter! Your subscription has been confirmed, and you're now part of our growing community.</p>
          
          <div class="promo">
            <p>Use the code below to get 20% off your first order:</p>
            <p class="promo-code">WELCOME20</p>
          </div>
          
          <p>Stay tuned for exclusive deals, style tips, and new product announcements.</p>
          
          <p>Best regards,<br>The Ink Dapper Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Ink Dapper. All rights reserved.</p>
          <p>417 Fashion Avenue, Style District, New York</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Ink Dapper" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Ink Dapper Newsletter!",
    text: `Welcome to Ink Dapper! Your subscription has been confirmed. Use code WELCOME20 to get 20% off your first order.`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};
