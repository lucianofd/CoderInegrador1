import { v4 as uuidv4 } from 'uuid';
import cartModel from '../models/cart.model.js';
import CartService from "../services/cartService.js";
import productManager from '../dao/ProductManager.js'; 
import ticketController from './ticketController.js';

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  //Crear carrito 
  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.send(newCart);
      req.logger.info("Cart created:", newCart)
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error creating cart:", error);
    }
  }
  //Obtener carrito
  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.send({ products: cart.products });
      req.logger.info("Cart retrieved:", cart);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error getting cart:", error);
    }
  }
  //Agregar prducto al carrito
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const userEmail = req.user ? req.user.email : null;
      
      if (!userEmail) {
        // El usuario no está autenticado, redirigir a la página de inicio de sesión
        return res.status(401).send({
          status: "error",
          message: "Usuario no autenticado. Por favor, inicia sesión.",
          redirectToLogin: true,
        });
      }
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
  //Aumentar cantidad de productos
  async updateQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantity(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  
  //Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProduct(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
  //Eliminar todos los productos
  async deleteProducts(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProducts(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }

  //TICKET*****
  async createPurchaseTicket(req, res) {
    try {
      const { cid } = req.params;
      const { user } = req;

      if (!user || !user.id) {
        return res.status(400).json({ error: "Usuario no definido" });
      }

      const cart = await cartService.getCart(cid);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const { products } = cart;

      const { failedProducts, successfulProducts, totalAmount } = await this.processProducts(products);

      await cartService.updateCart(cid, failedProducts);

      if (successfulProducts.length === 0) {
        return res.status(400).json({
          error: "No se agrego ningún producto",
          failedProducts,
        });
      }

      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: user.email,
      };

      const ticketCreated = await ticketController.createTicket({ body: ticketData });
      res.json({
        status: "success",
        message: "Compra realizada con éxito",
        ticket: ticketCreated,
        failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
      });
    } catch (error) {
      console.error("Error al crear el ticket de compra:", error);
      res.status(500).json({ error: "Error al crear el ticket de compra" });
    }
  }

  async processProducts(products) {
    const failedProducts = [];
    const successfulProducts = [];
    let totalAmount = 0;

    for (const item of products) {
      const { product, quantity } = item;
      const productInfo = await productManager.getProductById(product);

      if (!productInfo) {
        console.error(`Producto ${product} no encontrado`);
        failedProducts.push(item);
      } else if (productInfo.stock < quantity) {
        console.error(`Stock insuficiente para el producto ${product}`);
        failedProducts.push(item);
      } else {
        successfulProducts.push(item);
        const newStock = productInfo.stock - quantity;
        await productManager.updateProduct(product, { stock: newStock });
        totalAmount += productInfo.price * quantity;
      }
    }

    return { failedProducts, successfulProducts, totalAmount };
  }

  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);

      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Compra no encontrada" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Error interno del servidor" });
    }
  }
}

export default new CartController();