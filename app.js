import 'dotenv/config';
import mongoose from 'mongoose';
import express from "express";
import __dirname from "./utils.js";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
//import ProductManager from "./src/dao/ProductManager.js";
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import viewsRouter from './src/routes/views.js';

const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = socketIO(server);
// Conexión a la base de datos 
mongoose.connect(databaseURL);


// Configura Handlebars como motor de plantillas
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views',path.join(__dirname) +'/views');
app.set('view engine', 'handlebars')

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
