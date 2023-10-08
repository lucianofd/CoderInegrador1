import ProductService from "../services/productService.js";
//import { io } from "../../app.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
  //Obtener lista de productos
  async getProducts(req, res) {
    try {
      const products = await this.productService.getProducts(req.query);
      res.send(products);
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error fetching products." });
      console.log(error);
    }
  }
  //Obtener un producto por su ID
  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      console.log("Product ID:", pid);
      const product = await this.productService.getProductById(pid);
      if (product) {
        res.json(product);
        return;
      } else {
        res
          .status(404)
          .send({ status: "error", message: "Product not found." });
        return;
      }
    } catch (error) {
      console.error("Error fetching product by id:", error);
      res
        .status(500)
        .send({ status: "error", message: "Error fetching product by id." });
      return;
    }
  }
  //Agregar un producto
  async addProduct(req, res) {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    

    if (!title) {res.status(400).send({
        status: "error",
        message: "Error! Required field : Title!",
      });
      return false;
    }

    if (!description) {res.status(400).send({
        status: "error",
        message: "Error! Required field : Description!",
      });
      return false;
    }

    if (!code) { res.status(400).send({
        status: "error",
        message: "Error! Required field : Code!",
      });
      return false;
    }

    if (!price) {
      res.status(400).send({ status: "error",
        message: "Error! Required field : Price!",
      });
      return false;
    }

    status = !status && true;

    if (!stock) {res.status(400).send({
        status: "error",
        message: "Error! Required field : Stock!",
      })
    }
  }
  //Modificar un producto
  async updateProduct(req, res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;
      const pid = req.params.pid;

      const wasUpdated = await this.productService.updateProduct(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });

      if (wasUpdated) {
        res.send({
          status: "ok",
          message: "El Producto se actualizó correctamente!",
        });
        socketServer.emit("product_updated");
      } else {
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo actualizar el Producto!",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    }
  }
  //Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;

      const wasDeleted = await this.productService.deleteProduct(pid);

      if (wasDeleted) {
        res.send({
          status: "ok",
          message: "El Producto se eliminó correctamente!",
        });
        socketServer.emit("product_deleted", { _id: pid });
      } else {
        res.status(500).send({
          status: "error",
          message: "Error! No se pudo eliminar el Producto!",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    }
  }
} 

export default ProductController