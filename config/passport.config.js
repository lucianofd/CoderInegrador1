import {ENV_CONFIG } from "../config/config.js"
import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import  userModel  from "../src/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import AuthService from "../src/services/authoService.js";

const JWTStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("login", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email", passwordField: "password" },
     async (username, password, done) => {
        const { email } = req.body;
        try {
            let user = await userModel.findOne({ email: username });

            if (!user) {
                
                return done(null, false, { message: "Usuario no encontrado" });
            }

            if (!isValidPassword(user, password)) {
               
                return done(null, false, { message: "Contraseña incorrecta" });
            }

            return done(null, user);
        } catch (error) {
            console.error("Error en la autenticación local:", error);
            return done(error);
        }
    }));

    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await userModel.findOne({ email: username });

            if (user) {
                console.error("El usuario " + email + " ya se encuentra registrado!");
                return done(null, false, { message: "El usuario ya existe" });
            }

            user = { first_name, last_name, email, age, password: createHash(password) };

            if (user.email === ENV_CONFIG.ADMIN_EMAIL) {
                req.logger.info("Asignando rol de admin");
                user.role = "admin";
            } else{
                req.logger.info("Asignando role de usuario");
                user.role = "user";
            }

            let result = await userModel.create(user);

            if (result) {
                return done(null, result);
            }
        } catch (error) {
            req.logger.error("Error durante el proceso de registro:", error);
            return done(error);
        }
    }));

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: ENV_CONFIG.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await userModel.findOne({email: jwt_payload.email});
            if (!user){
            return done(null, false, {message: "Usuario no encontrado"});
            }
            return done(null, user);
        } catch (error) {
            console.error("Error en la autenticación JWT:", error);
            return done(error);
        }
    }));

    passport.use(
        "github",
        new GitHubStrategy(
          {
            clientID: CLIENT_ID_GITHUB,
            clientSecret: CLIENT_SECRET_GITHUB,
            callbackURL: "http://localhost:8000/api/sessions/githubcallback",
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              const authService = new AuthService();
              console.log("Profile:", JSON.stringify(profile, null, 2));
              const user = await authService.githubCallback(profile);
      
              if (user) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            } catch (error) {
              return done(error);
            }
          }
        )
      );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error en la deserialización del usuario:", error);
            done(error);
        }
    });
};

const cookieExtractor = (req) => {
    let token = null;
  
    if (req && req.cookies) {
      req.logger.info("Cookies:", req.cookies);
      token = req.cookies["coderCookieToken"];
    }
  
    req.logger.info("Token Extracted:", token);
    return token;
  };

export default initializePassport;
