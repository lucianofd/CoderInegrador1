import ProductManager from '../dao/ProductManager.js';

class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }
  //Agregar producto
  async addProduct(product) {
    if (await this.productManager.validateCode(product.code)) {
      console.log("Error! Code exists!");
      return null;  
    }

    return await this.productManager.addProduct(product);
  }
  //Obtener listado de productos
  async getProducts(params) {
    return await this.productManager.getProducts(params);
  }
  //Obtener un producto
  async getProductById(id) {
    return await this.productManager.getProductById(id);
  }
  //Modificar un producto
  async updateProduct(id, product) {
    return await this.productManager.updateProduct(id, product);
  }
  //Eliminar un producto
  async deleteProduct(id) {
    return await this.productManager.deleteProduct(id);
  }
}

export default ProductService;