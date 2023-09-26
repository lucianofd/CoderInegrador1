import 'dotenv/config';
import express from "express";
import { createHash, isValidPassword, passportCall, authorization } from "../utils.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { userModel } from "../dao/models/user.model.js";
const PRIVATE_KEY = "";

const sessionRouter = express.Router();

sessionRouter.post("/login", async (req, res) => {
    const {email, pass} = req.body;

    let user = await userModel.findOne({email:email});

    if (!user) {
        return res.status(401).send({status:"error", message:"Error! El usuario no existe!"});
    }

    
    let token = jwt.sign({email:email, password:pass, role:user.role}, PRIVATE_KEY, {expiresIn:"24h"});
    res.cookie("coderCookieToken", token, {maxAge:3600*1000, httpOnly:true});

    return res.redirect("/products");
});

sessionRouter.get("/logout", async (req, res) => {
    req.session.destroy;
    res.redirect("/");
});

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    return res.redirect("/login");
});

sessionRouter.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"ok", message:"La contraseña se ha actualizado correctamente!"});
    } else {
        res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña!"});
    }    
});

sessionRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send({status:"OK", payload:req.user});
});

sessionRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

export default sessionRouter;