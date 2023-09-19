import express from "express";
import UserManager from "../dao/UserManager.js";
import { createHash } from "../../utils.js";
import { isValidPassword } from "../../utils.js";
import passport from "passport";
import viewsRouter from "./views.js";

const sessionRouter = express.Router();
const UM = new UserManager();

sessionRouter.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req, res) => {
    if (!req.user) {
        return res.status(401).send({status:"Error", message:"Usuario y Contraseña incorrectos!"});
    }

    req.session.user = {first_name:req.user.first_name, last_name:req.user.last_name, email:req.user.email, age:req.user.age};
    res.redirect("/products");
});

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    res.redirect("/login");
});

sessionRouter.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"OK", message:"La contraseña se ha actualizado correctamente!"});
    } else {
        res.status(401).send({status:"Error", message:"No se pudo actualizar la contraseña!"});
    }    
});

sessionRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

viewsRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/profile");
        }
        res.redirect("/login");
    });
});


export default sessionRouter;