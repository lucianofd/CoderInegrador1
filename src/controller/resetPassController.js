import nodemailer from "nodemailer";
import userModel from "../models/user.model.js";
import crypto from "crypto";
import UserService from "../services/userService.js";

const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserService.getUser({ email});
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:8000/reset-password/${resetToken}`;
    let mailOptions = {
      from: process.env.EMAIL_SENDER || "tuemail@example.com",
      to: userEmail,
      subject: "Link de restablecimiento de contraseña",
      text: `Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${resetUrl}`,
      html: `<p>Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: <a href="${resetUrl}">restablecer contraseña</a></p>`,
    };

     const info = await transporter.sendMail(mailOptions);
    logger.info("Message sent:", info.messageId);
  } catch (error) {
    // Handle and log the error appropriately
    console.error("Error sending reset password email:", error);
    throw error; // Re-throw the error to inform the calling code
  }
};

export default sendResetPasswordEmail;
