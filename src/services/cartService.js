import CartManager from "../dao/CartManager.js";

class CartService {
  constructor() {
    this.cartManager = new CartManager();
  }
  
  async createCart() {
    return await this.cartManager.newCart();
  }

  async getCart(id) {
    return await this.cartManager.getCart(id);
  }

  async getCarts(){
    return await this.cartManager.getCarts();
  }

  async addProductToCart(cid, pid) {
    const result = await this.cartManager.addProductToCart(cid, pid);
    if (result) {
      return { status: "ok", message: "Producto agregado!" };
    } else {
      throw new Error("Error! No se pudo agregar el producto!");
    }
  }

  async updateQuantity(cid, pid, quantity) {
    const result = await this.cartManager.updateQuantity(
      cid,
      pid,
      quantity
    );
    if (result) {
      return {
        status: "ok",
        message: "Producto agregado con exito.",
      };
    } else {
      throw new Error("Error: No se pudo agregar el producto");
    }
  }

  async deleteProduct(cid, pid) {
    const result = await this.cartManager.deleteProduct(
      cid,
      pid,
    );
    if (result) {
      return { status: "ok", message: "Producto eliminado" };
    } else {
      throw new Error("Error: No se pudo eliminar el producto");
    }
  }

  async deleteCart(cid) {
    try {
      
      const result = await this.cartManager.deleteProduct(cid);
  
      if (result) {
        
        return { status: "ok", message: "El carrito se eliminó correctamente." };
      } else {
        
        return { status: "error", message: "Error: No se pudo eliminar el carrito." };
      }
    } catch (error) {
      
      console.error("Error deleting cart:", error);
      
      return { status: "error", message: "Error interno al eliminar el carrito." };
    }
  }

  

  async deleteProducts(cartId) {
    const result = await this.cartManager.deleteProducts(cartId);
    if (result) {
      return { status: "ok", message: "El carrito se vació correctamente!" };
    } else {
      throw new Error('Error! No se pudo vaciar el Carrito!');
    }
  }
}

export default CartService;