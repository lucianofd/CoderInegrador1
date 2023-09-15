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
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import ProductManager from './src/dao/ProductManager.js';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import viewsRouter from './src/routes/views.js';
import CartManager from './src/dao/CartManager.js';
import sessionRouter from './src/routes/session.js';

/*
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error('Missing GitHub OAuth configuration');
  process.exit(1); 
}
*/
const app = express();
const PORT = 8080;

const mongoUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.GITHUB_SECRET;
app.use(session({
  store:MongoStore.create({
    mongoUrl: mongoUrl,
    mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
    ttl:10000
  }),
  secret: sessionSecret, 
  resave:false,
  saveUninitialized:false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
const io = new Server(server);

//servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
// Middleware para el manejo de JSON en el body
app.use(express.json());


// Configura Handlebars como motor de plantillas
const PM = new ProductManager();
const CM = new CartManager();

app.set("views", __dirname + "/src/views");
app.engine('handlebars', expressHandlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");

// Especifica la ubicación de las vistas
//app.set('views', path.join(__dirname, 'views'));
app.use('/src/public', express.static(__dirname + "/src/public"));
// routers de productos y carritos. rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionRouter);
app.use("/", viewsRouter);



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

