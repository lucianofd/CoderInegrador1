
import { productModel } from "./models/products.model.js";

class ProductManager {

  
  async addProduct(product) {
    
    try {
      const codeExists = await this.validateCode(product.code);
      if (codeExists) {
        throw new Error("El código del producto ya está en uso");
      } else {
        await productModel.create(product);
        console.log("Product added!");
        return true;
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
      return false;
    }

  }
   
  // GET Y PAGINATION
  async getProducts(params) {
    try {
      let { limit, page, query, sort } = params;
      limit = limit || 10;
      page = page || 1;
      query = query || {};
      sort = sort === "asc" ? 1 : sort === "desc" ? -1 : 0;
  
      const products = await productModel.paginate(query, {
        limit,
        page,
        sort: { price: sort },
      });
  
      const status = products ? "success" : "error";
  
      const prevLink = products.hasPrevPage
        ? `/products?limit=${limit}&page=${products.prevPage}`
        : null;
      const nextLink = products.hasNextPage
        ? `/products?limit=${limit}&page=${products.nextPage}`
        : null;
  
      const result = {
        status,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink,
        nextLink,
      };
  
      return result;
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
      return { status: "error", message: "Error interno del servidor" };
    }
  }
  

  //GET BY ID
  async getProductById(id) {
    try {
      if (!this.validateId(id)) {
        throw new Error("ID inválido");
      }
  
      const product = await productModel.findOne({ _id: id }).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }
  
      return product;
    } catch (error) {
      console.error("Error al obtener el producto", error.message);
      return null;
    }
  }
  
  //UPDATE
  async updateProduct(id, product) {
    
    try {
      if (!this.validateId(id)) {
        throw new Error("ID inválido");
      }
  
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        throw new Error("Producto no encontrado");
      }
  
      await productModel.updateOne({ _id: id }, product);
      console.log("Product updated!");
  
      return true;
    } catch (error) {
      console.log("Not found!");

      return false;
    }
  } 
  //DELETE
  async deleteProduct(id) {
    try {
      if (!this.validateId(id)) {
        throw new Error("ID inválido");
      }
  
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        throw new Error("Producto no encontrado");
      }
  
      await productModel.deleteOne({ _id: id });
      console.log("Product deleted!");
  
      return true;
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      return false;
    }
  }
  


    validateId(id) {
       return id.length === 24 ? true : false;
      }

    async validateCode(code) {
       return await productModel.findOne({code:code}) || false;
    }
}

export default ProductManager;