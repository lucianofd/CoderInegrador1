import nodemailer from "nodemailer";
import { ENV_CONFIG } from "./config.js";


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: ENV_CONFIG.EMAIL_USER,
      pass: ENV_CONFIG.EMAIL_PASS,
    },
  });
  
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  
  export default transporter;