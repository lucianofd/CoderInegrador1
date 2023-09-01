import express from "express";
import ProductManager from "../dao/ProductManager.js";

const viewsRouter = express.Router();
const PM = new ProductManager();

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


export default viewsRouter;