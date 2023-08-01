const express = require('express');
const fs = require('fs');

const router = express.Router();

//GET obtener todos los productos
productsRouter.get('/', (req, res) => {
    // Leer el archivo productos.json y enviar los productos
    fs.readFile('productos.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo productos.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const productos = JSON.parse(data);
        res.json(productos);
      }
    });
  });

//GET obtener un producto por id (pid)
productsRouter.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    fs.readFile('productos.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo productos.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const productos = JSON.parse(data);
        const producto = productos.find((p) => p.id === pid);
        if (producto) {
          res.json(producto);
        } else {
          res.status(404).json({ error: 'Producto no encontrado' });
        }
      }
    });
  });
  
 //POST agregar un nuevo producto
productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    fs.readFile('productos.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo productos.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const productos = JSON.parse(data);
        // Generar un id único
        newProduct.id = Date.now().toString();
        productos.push(newProduct);
        fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
          if (err) {
            console.error('Error al escribir el archivo productos.json', err);
            res.status(500).json({ error: 'Error interno del servidor' });
          } else {
            res.status(201).json(newProduct);
        }
      });
    }
  });
});

//PUT actualizar un producto por id (pid)
productsRouter.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    fs.readFile('productos.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo productos.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const productos = JSON.parse(data);
        const index = productos.findIndex((p) => p.id === pid);
        if (index !== -1) {
          // No actualizar el id
          updatedProduct.id = pid;
          productos[index] = updatedProduct;
          fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
            if (err) {
              console.error('Error al escribir el archivo productos.json', err);
              res.status(500).json({ error: 'Error interno del servidor' });
            } else {
              res.json(updatedProduct);
            }
          });
        } else {
          res.status(404).json({ error: 'Producto no encontrado' });
        }
      }
    });
  });

// DELETE para eliminar producto por id (pid)
productsRouter.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    fs.readFile('productos.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo productos.json', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        let productos = JSON.parse(data);
        productos = productos.filter((p) => p.id !== pid);
        fs.writeFile('productos.json', JSON.stringify(productos), (err) => {
          if (err) {
            console.error('Error al escribir el archivo productos.json', err);
            res.status(500).json({ error: 'Error interno del servidor' });
          } else {
            res.json({ message: 'Producto eliminado exitosamente' });
          }
        });
    }
  });
});

// Asigna a la ruta /api/products
app.use('/api/products', productsRouter);



module.exports = router;
