const express = require('express');
const fs = require('fs');
const cartsRouter = express.Router();

// POST: Crea un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const newCart = req.body;
  newCart.id = Date.now().toString(); //id único para el carrito
  newCart.products = []; // Inicializa el arreglo de productos
  fs.writeFile('carrito.json', JSON.stringify(newCart), (err) => {
    if (err) {
      console.error('Error al escribir el archivo carrito.json', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(201).json(newCart);
    }
  });
});

// GET Obtiene productos de un carrito por su id (cid)
cartsRouter.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo carrito.json', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      const carrito = JSON.parse(data);
      if (carrito.id === cid) {
        res.json(carrito.products);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    }
  });
});

// POST Agregar producto a un carrito por su id (cid) y el id del producto (pid)
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    // lee carrito y productos
    const cartData = await fs.readFile('carrito.json', 'utf8');
    const cart = JSON.parse(cartData);
    
    const productData = await fs.readFile('productos.json', 'utf8');
    const products = JSON.parse(productData);
    
    // Encontrar el producto a agregar por su id
    const productToAdd = products.find(product => product.id === pid);
    
    if (!productToAdd) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

     // Verifica si el producto ya está en el carrito
     const existingProductIndex = cart.products.findIndex(item => item.product === pid);
     if (existingProductIndex !== -1) {
       // Incrementa la cantidad si ya existe
       cart.products[existingProductIndex].quantity++;
     } else {
       // Agregar producto al carrito con cantidad 1
       cart.products.push({ product: pid, quantity: 1 });
     }
     
     // Actualiza el archivo del carrito
     await fs.writeFile('carrito.json', JSON.stringify(cart));
     
     res.json(cart.products);
   } catch (error) {
     console.error('Error al agregar producto al carrito', error);
     res.status(500).json({ error: 'Error interno del servidor' });
   }
 });

module.exports = cartsRouter;
