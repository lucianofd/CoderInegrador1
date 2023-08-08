const express = require('express');
const fs = require('fs');

const ProductManager = require('../ProductManager');

const productsRouter = express.Router();
const productManager = new ProductManager('../public/productos.json');


//POST agregar un producto
productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);
  // Emitir evento a través de WebSocket
  io.emit('updateProducts');
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//GET obtener un producto por id (pid)
productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
      const product = await productManager.getProductById(pid);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
 //Get obtener listado de productos
productsRouter.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET para la vista en tiempo real
productsRouter.get('/realtimeproducts', (req, res) => {
  const productData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productData);
  res.render('realTimeProducts', { products });
});


//PUT actualizar un producto por id (pid)
productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    try {
      await productManager.updateProduct(pid, updatedProduct);
      io.emit('updateProducts');
      res.json('Prodcuto actualizado!');
    } catch (error) {
      res.status(500).json({ error:'Error interno' });
    }
  });

// DELETE para eliminar producto por id (pid)
productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
      await productManager.deleteProduct(pid);
      io.emit('updateProducts')
      res.json('Producto eliminado!');
    } catch(error){
      res.status(500).json({error:'Error interno'});
    }
});


module.exports = productsRouter;
