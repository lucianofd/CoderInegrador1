const express = require('express');
const fs = require('fs');

const cartsRouter = express.Router();

//POST crea un nuevo carrito
cartsRouter.post('/', (req, res) => {
    const newCart = req.body;
    // Generar un id único
    newCart.id = Date.now().toString();
    newCart.products = [];
    // Escribir el nuevo carrito en el archivo carrito.json
    fs.writeFile('carrito.json', JSON.stringify(newCart), (err) => {
      if (err) {
        console.error('Error al escribir el archivo carrito.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(201).json(newCart);
      }
    });
  });

//GET obtener productos de un carrito por su id (cid)
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
  
//POST agregar producto a un carrito por su id (cid) y el id del producto (pid)
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    res.send(`Producto con ID ${pid} agregado al carrito con ID ${cid}`);
});
  

module.exports = cartsRouter;