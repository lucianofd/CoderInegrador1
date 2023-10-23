import express from "express";
import {sendEmail, sendEmailWithAtt} from '../controllers/email.controller.js';

const emailRouter = express.Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAtt);

export default emailRouter;