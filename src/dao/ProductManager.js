
const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.currentId = 1;
  }

  async addProduct(product) {
    // Validar los campos requeridos
    if (!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock) {
      console.log("Todos los campos son obligatorios 1");
      return;
    }

    try {
      const products = await this.getProducts();

      // Verificar si el código ya existe
      const existProduct = products.find((p) => p.code === product.code);
      if (existProduct) {
        console.log(`El código ${product.code} ya está en uso`);
        return;
      }

      
      const newProduct = {
        id: this.currentId++,
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: "C" + this.currentId.toString().padStart(4, "0"),
        stock: product.stock,
        status: true,
        category: product.category
      };

      // Agregar el nuevo producto 
      products.push(newProduct);

      // Guardar los productos en el archivo
      await this.saveProducts(products);

      console.log('Producto agregado correctamente');
    } catch (error) {
      console.log('Error al agregar el producto:', error);
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log('Error al obtener los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      return product;
    } catch (error) {
      console.log('Error al obtener el producto por ID:', error);
    }
  }

  async updateProduct(id, updatedRegist) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);

      if (index !== -1) {
        // Actualiza los campos del producto
        products[index] = {
          ...products[index],
          ...updatedRegist,
          id, // Asegura que el ID no se borre
        };

        // Guardar los productos actualizados
        await this.saveProducts(products);

        console.log('Producto actualizado correctamente');
      } else {
        console.log('No se encontró el producto con el ID especificado');
      }
    } catch (error) {
      console.log('Error al actualizar el producto:', error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((product) => product.id !== id);

      if (filteredProducts.length < products.length) {
        // Guardar los productos actualizados en el archivo
        await this.saveProducts(filteredProducts);

        console.log('Producto eliminado correctamente');
      } else {
        console.log('No se encontró el producto con el ID especificado');
      }
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
    }
  }

  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;