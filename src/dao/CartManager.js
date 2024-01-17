import cartModel from "../models/cart.model.js";

class CartManager {
  //Crea carrito
  async newCart() {
    let cart = await cartModel.create({ products: [] });
    console.log("Cart created!");

    return cart;
  }
  
  //Obtener carriot por id
  async getCart(id) {
    if (this.validateId(id)) {
      return (await cartModel.findOne({ _id: id }).lean()) || null;
    } else {
      console.log("Not found!");

      return null;
    }
  }

  //Obtener todos los carritos
  async getCarts() {
    return await cartModel.find().lean();
  }

  //Agregar producto al carrito
  async addProductToCart(cid, pid, userId) {
    try {
      if (!userId) {
        throw new Error("User not authenticated. Please log in.");
      }

      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const product = cart.products.find((item) => item.product === pid);

        // Verifica si el usuario es premium y si el producto le pertenece
        if (
          product &&
          userId === product.owner.toString() &&
          userRole === "premium"
        ) {
          return {
            success: false,
            message: "Premium users cannot add their own products to the cart.",
          };
        }

        if (product) {
          product.quantity += 1;
        } else {
          cart.products.push({ product: pid, quantity: 1 });
        }

        await cartModel.updateOne({ _id: cid }, { products: cart.products });

        return {
          success: true,
          message: "Product added to the cart successfully.",
        };
      } else {
        return {
          success: false,
          message: "Invalid cart ID.",
        };
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return {
        success: false,
        message:
          "An error occurred while adding the product to the cart. Please try again.",
      };
    }
  }

  //Agregar cantidad de producto a un carrito
  async updateQuantity(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const product = cart.products.find((item) => item.product === pid);
        product.quantity = quantity;

        await cartModel.updateOne({ _id: cid }, { products: cart.products });
        console.log("Product updated!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }
  //Eliminar un producto
  async deleteProduct(cid, pid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        const products = cart.products.filter((item) => item.product !== pid);

        await cartModel.updateOne({ _id: cid }, { products: products });
        console.log("Product deleted!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }
  //Eliminar todos los productos
  async deleteProducts(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);

        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("Products deleted!");

        return true;
      } else {
        console.log("Not found!");

        return false;
      }
    } catch (error) {
      return false;
    }
  }

  validateId(id) {
    return id.length === 24 ? true : false;
  }
}

export default CartManager;
