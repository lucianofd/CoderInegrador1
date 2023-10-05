import CartService from "../services/cartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.send(newCart);
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.send({ products: cart.products });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

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

  

  async deleteProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProduct(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }

  async deleteProducts(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProducts(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
}

export default new CartController();