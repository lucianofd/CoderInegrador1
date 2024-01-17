
import express from "express";
import { ENV_CONFIG } from "../../config/config.js";
import {  passportCall, authorization } from "../../utils.js";
import passport from "passport";
import UserController from '../controller/userController.js';
import AuthController from '../controller/authoController.js';


const sessionRouter = express.Router();
const sessionController = new AuthController();
const userController = new UserController();

const PRIVATE_KEY = ENV_CONFIG.JWT_SECRET || 'S3CR3T';
console.log(PRIVATE_KEY);

sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => userController.register(req, res));

sessionRouter.post("/login", async (req, res) => sessionController.login(req, res));

sessionRouter.post("/logout", async (req, res) => sessionController.logout(req, res));

//Modificar Password
sessionRouter.post("/restore-password", async (req, res) => userController.restorePassword(req, res));

//Recuperar Password--/// REVISAR INPUTS EMAIL.. DEBERIA LLEGAR X PARAMS
sessionRouter.post("/reset-password/:token", async(req, res)=> userController.resetPassword());

sessionRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => userController.currentUser(req, res));

sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => sessionController.github(req, res));

sessionRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => sessionController.githubCallback(req, res));

export default sessionRouter;
