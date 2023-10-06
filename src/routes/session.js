import 'dotenv/config';
import express from "express";
import { createHash, isValidPassword, passportCall, authorization } from "../../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserController from '../controller/userController.js';
import AuthController from '../controller/authoController.js';


const sessionRouter = express.Router();
const sessionController = AuthController;
const userController = UserController;

const PRIVATE_KEY = process.env.JWT_SECRET || 'S3CR3T';

sessionRouter.post("/login", async (req, res) => sessionController.login(req, res));

sessionRouter.get("/logout", async (req, res) => sessionController.logout(req, res));

sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => userController.register(req, res));

sessionRouter.get("/restore", async (req, res) => userController.restorePassword(req, res));

sessionRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => sessionController.currentUser(req, res));

sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => sessionController.github(req, res));

sessionRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => sessionController.githubCallback(req, res));

export default sessionRouter;
