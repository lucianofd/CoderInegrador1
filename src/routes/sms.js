import express from "express";
import { sendSMS } from "../controller/smsController.js";

const smsRouter = express.Router();

smsRouter.get("/", sendSMS);

export default smsRouter;