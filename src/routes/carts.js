import express from 'express';
import CartController from '../controller/cartController.js';
import { authorization, passportCall } from '../../utils.js';


const cartsRouter = express.Router();
const cartController = CartController;
//const CM = new CartManager();

// POST: Crea un nuevo carrito
cartsRouter.post('/', async (req, res) => cartController.addProductToCart(req,res) );

// GET Obtiene productos de un carrito por su id (cid)
cartsRouter.get('/:cid', async  (req, res) => cartController.getCart(req, res));

// POST Agregar producto a un carrito 
cartsRouter.post('/:cid/product/:pid', async (req, res) => cartController.addProductToCart(req, res));

//Agregar cantidad de productos
cartsRouter.put("/:cid/products/:pid", async (req, res) => cartController.updateQuantity(req, res));

//Eliminar producto
cartsRouter.delete("/:cid/products/:pid", async (req, res) => cartController.deleteProduct(req, res));

//Eliminar carrito
cartsRouter.delete("/:cid", async (req, res) => cartController.deleteProducts(req, res));

//Final compra
cartsRouter.post("/:cid/purchase", (req, res, next) => {
    next();
  }, passportCall("jwt"),(req, res) => cartController.createPurchaseTicket(req, res));


export default cartsRouter;
