import ProductService from "../services/productService.js";
import { io } from "../../app.js";
import CustomError from "../services/errors/CustomError.js";
import { generateAuthenticationErrorInfo } from "../services/errors/messages/auth-error.js";
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
      const productError = new CustomError({
        name: "Product Fetch Error",
        message: "Error fetching products.",
        code: 500,
        cause: error.message,
      });
      console.error(productError);
      res.status(productError.code).send({
        status: "error",
        message: "Error fetching products.",
      });
    }   
  }
  //Obtener un producto por su ID
  async getProductById(req, res) {
    try {
      const pid = req.params.pid;
      req.logger.info("Product ID:", pid);
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new CustomError({
          name: "Product Not Found Error",
          message: generateProductErrorInfo(pid),
          code: 404,
        });
      }

      res.status(200).json({
        status: "success",
        data: product,
      });
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

    try {
      const wasAdded = await this.productService.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });

      if (wasAdded && wasAdded._id) {
        req.logger.info("Product added:", wasAdded);
        res.send({
          status: "ok",
          message: "Product added succesfully!",
        });
        io.emit("product_created", {
          _id: wasAdded._id,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails,
        });
        return;
      } else {
        req.logger.error("Product added fail, wasAdded:", wasAdded);
        res.status(500).send({
          status: "error",
          message: "Error! Can't add product!",
        });
        return;
      }
    } catch (error) {
      req.logger.error("Error en addProduct:", error, "Stack:", error.stack);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
      return;
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
          message: "Product update success!",
        });
        io.emit("product_updated");
      } else {
        res.status(500).send({
          status: "error",
          message: "Error! Can't updated product!",
        });
      }
    } catch (error) { 
      req.logger.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    }
  }
  //Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;

      const product = await this.productService.getProductById(pid);

      if (!product) {
        req.logger.error("Product not found");
        res.status(404).send({
          status: "error",
          message: "Product not found",
        });
        return;
      }


      const wasDeleted = await this.productService.deleteProduct(pid);

      if (wasDeleted) {
        req.logger.info("Product deleted successful")
        res.send({
          status: "ok",
          message: "Product deleted successful",
        });
        socketServer.emit("product_deleted", { _id: pid });
        io.emit("Product deleted successful", {_id: pid})
      } else {
        req.logger.error("Deleted Fail!")
        res.status(500).send({
          status: "error",
          message: "Error! Delete product fail!",
        });
      }
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
    }
  }
} 

export default ProductController