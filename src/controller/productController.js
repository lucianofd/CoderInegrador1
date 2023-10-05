import ProductService from "../services/productService.js";
import { socketServer } from "../../app.js";

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

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
    

    if (!title) {
      res.status(400).send({
        status: "error",
        message: "Error! Required field : Title!",
      });
      return false;
    }

    if (!description) {
      res.status(400).send({
        status: "error",
        message: "Error! Required field : Description!",
      });
      return false;
    }

    if (!code) {
      res.status(400).send({
        status: "error",
        message: "Error! Required field : Code!",
      });
      return false;
    }

    if (!price) {
      res.status(400).send({
        status: "error",
        message: "Error! Required field : Price!",
      });
      return false;
    }

    status = !status && true;

    if (!stock) {
      res.status(400).send({
        status: "error",
        message: "Error! Required field : Stock!",
      })
    }
  }
} 