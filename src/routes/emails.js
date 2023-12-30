import express from "express";
import {sendEmail, sendEmailWithAtt} from '../controller/emailController.js';

const emailRouter = express.Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAtt);

export default emailRouter;