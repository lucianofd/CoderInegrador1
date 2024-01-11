import nodemailer from "nodemailer";
import { ENV_CONFIG } from "../../config/config.js";
import transporter from "../../config/nodemailConfig.js";



export const sendEmail = async (req, res) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Message sent:", info.messageId);
    res.send({ message: "Success!", payload: info });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el correo electrónico desde:" + ENV_CONFIG.EMAIL_USER,
    });
  }
};

export const sendEmailWithAtt = async (req, res) => {
  try {
    const info = await transporter.sendMail(mailOptionsWithAtt);
    logger.info("Message sent:", info.messageId);
    res.send({ message: "Success!", payload: info });
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el correo electrónico desde:" + ENV_CONFIG.EMAIL_USER,
    });
  }
};