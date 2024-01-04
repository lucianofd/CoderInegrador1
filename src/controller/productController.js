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
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized: User not logged in.",
        });
    }
      //Validar rol para operacion
    if (!(user.role === 'admin' || user.role === 'premium')) {
        return res.status(403).json({
            status: "error",
            message: "Forbidden: User does not have permission to add products.",
        });
    }

    const {
        title, description,
        code, price,
        status, stock,
        category, thumbnails,
    } = req.body;

    // Validacion campos
    if (!title || !description || !code || !price || !stock) {
        return res.status(400).send({
            status: "error",
            message: "Error! Required fields.",
        });
    }

    try {
        // agregar un producto
        const wasAdded = await this.productService.addProduct({
            title, description,
            code, price,
            status, stock,
            category, thumbnails,
            owner: user.email,
        });

        if (wasAdded !== undefined && wasAdded !== null) {
          // Lógica cuando el producto se ha añadido correctamente
          req.logger.info("Product added:", wasAdded);
          res.send({
            status: "ok",
            message: "Product added succesfully!",
          });

            // Emitir evento ?
            io.emit("product_created", {
                _id: wasAdded._id,
                title, description,
                code, price,
                status, stock,
                category, thumbnails,
            });
        } else {
            req.logger.error("Product added fail, wasAdded:", wasAdded);
            res.status(500).send({
                status: "error",
                message: "Error! Can't add product!",
            });
          }
      } catch (error) {
        // Manejo  de errores
        req.logger.error("Error en addProduct:", error, "Stack:", error.stack);

        // mensaje específico según el tipo de error
        if (error instanceof SpecificErrorType) {
            return res.status(500).send({
                status: "error",
                message: "Error específico al agregar el producto.",
            });
        }

        res.status(500).send({
            status: "error",
            message: "Internal server error.",
        });
        }
  }

  //UPDATE product
  async updateProduct(req, res) {
    try {
        const {
            title, description,code,price,status,stock,category,thumbnails,
        } = req.body;
        const pid = req.params.pid;

        // Obtener el producto/verificar el propietario
        const actualProduct = await this.productService.getProductById(pid);

        if (!actualProduct) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado.",
            });
        }

        // Verificar si el usuario es propietario o un admi
        const user = req.user;

        if (!(user.role === 'admin' || actualProduct.owner.toString() === user.email)) {
            return res.status(403).json({
                status: "error",
                message: "Prohibido: No tienes permiso para actualizar este producto.",
            });
        }

        const wasUpdated = await this.productService.updateProduct(pid, {
            title,description,
            code,price,status,
            stock,category, thumbnails,
        });

        if (wasUpdated) {
            res.send({
                status: "ok",
                message: "¡El Producto se actualizó correctamente!",
            });

            io.emit("product_created", {
              _id: wasUpdated._id,
              title, description,
              code, price,
              status, stock,
              category, thumbnails,
          });;
        } else {
            res.status(500).send({
                status: "error",
                message: "Error! No se pudo actualizar el Producto!",
            });
        }
    } catch (error) {
      req.logger.error("Error en updateProduct:", error, "Stack:", error.stack);

      // mensaje específico según el tipo de error
      if (error instanceof SpecificErrorType) {
          return res.status(500).send({
              status: "error",
              message: "Error específico al actualizar el producto.",
          });
      }
        res.status(500).send({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
}


  //Eliminar un producto
  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;

      const actualProduct = await this.productService.getProductById(pid);

      if (!actualProduct) {
        req.logger.error("Product not found");
        res.status(404).send({
          status: "error",
          message: "Product not found",
        });
        return;
      }

      // Verificar si el usuario es propietario o un admi
      const user = req.user;

      if (!(user.role === 'admin' || actualProduct.owner.toString() === user.email)) {
          return res.status(403).json({
              status: "error",
              message: "Prohibido: No tienes permiso para eliminar este producto.",
          });
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