const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');

const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);


const PORT = 8080;

// Configura Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// Middleware para el manejo de JSON en el body
app.use(express.json());

// routers de productos y carritos. rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//conexion de socket
io.on('connection', (socket) => {
  console.log('Cliente conectado por WebSocket');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

//servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
