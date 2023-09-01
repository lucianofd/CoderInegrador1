import 'dotenv/config';
import './config/database.js';
import mongoose from 'mongoose';
import express from "express";
import __dirname from "./utils.js";
import { Server } from 'socket.io';
import http from 'http';
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import ProductManager from './src/dao/ProductManager.js';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import viewsRouter from './src/routes/views.js';

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server);

// Conexión a la base de datos 
//mongoose.connect(databaseURL);
//servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});


// Configura Handlebars como motor de plantillas
const PM = new ProductManager();

app.set("views", __dirname + "/views");
app.engine('handlebars', expressHandlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
// routers de productos y carritos. rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

// Middleware para el manejo de JSON en el body
app.use(express.json());


//conexion de socket
io.on('connection', (socket) => {
  console.log('Cliente conectado por WebSocket');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });


const products = PM.getProducts();
socket.emit("realTimeProducts", products);

socket.on("nuevoProducto", (data) => {
    const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
    PM.addProduct(product);
    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);
});

socket.on("eliminarProducto", (data) => {
    PM.deleteProduct(parseInt(data));
    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);
});

});

