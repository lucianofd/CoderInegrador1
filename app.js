const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');

const PORT = 8080;

// Middleware para el manejo de JSON en el body
app.use(express.json());

// routers de productos y carritos. rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
