import express from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";



const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  };
  
  const checkAlreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
      console.log("Usuario ya autenticado, redirigiendo a /profile");
      res.redirect("/profile");
    } else {
      console.log("Usuario no autenticado, procediendo...");
      next();
    }
  };

  
const viewsRouter = express.Router();
const PM = new ProductManager();
const CM = new CartManager();

viewsRouter.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("home", {products});
});

viewsRouter.get("/products", async (req, res) => { 
    const products = await PM.getProducts(req.query);
    res.render("products", {products});
});

viewsRouter.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const product = await PM.getProductById(pid);

    res.render("product", {product});
});

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

viewsRouter.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.render("cart", {products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});

viewsRouter.get("/login", checkAlreadyLoggedIn, (req, res) => {
    res.render("login");
  });
  
viewsRouter.get("/register", checkAlreadyLoggedIn, (req, res) => {
    res.render("register");
  });
  
viewsRouter.get("/profile", checkSession, (req, res) => {
    const userData = req.user;
    res.render("profile", { user: userData });
  });
  
viewsRouter.get("/restore", async (req, res) => {
    res.render("restore");
  });

viewsRouter.get("/faillogin", (req, res) => {
    res.status(401).send({status: "Error", message: "Usuario y/o contraseña incorrectos"});
  });
  
viewsRouter.get("/failregister", async (req, res) => {
    res.send({
      status: "Error",
      message: "Error! No se pudo registar el Usuario!",
    });
  });


export default viewsRouter;