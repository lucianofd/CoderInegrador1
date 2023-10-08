import express from 'express';
import ProductManager from '../dao/ProductManager.js';
import ProductController from '../controller/productController.js'

const productsRouter = express.Router();
const PM = new ProductManager();
const  productController = ProductController;


//POST agregar un producto
productsRouter.post('/', async (req, res) => productController.addProduct(req, res));

//GET obtener un producto por id (pid)
productsRouter.get('/:pid', async (req, res) => productController.getProductsById(req, res));
  
 //Get obtener listado de productos
productsRouter.get('/', async (req, res) => productController.getProducts(req, res));
 

// GET para la vista en tiempo real
productsRouter.get('/realtimeproducts', (req, res) => {
  const productData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productData);
  res.render('realTimeProducts', { products });
});


//PUT actualizar un producto por id (pid)
productsRouter.put('/:pid', async (req, res) => productController.updateProduct(req,res));

// DELETE para eliminar producto por id (pid)
productsRouter.delete('/:pid', async (req, res) => productController.deleteProduct(req,res));


export default productsRouter;
