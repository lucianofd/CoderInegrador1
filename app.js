import 'dotenv/config';
import './config/database.js';
import {ENV_CONFIG} from './config/config.js'
import mongoose from 'mongoose';
import express from "express";
import __dirname from "./utils.js";
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import loggerRouter from './src/routes/logger.js';
import { addLogger, devLogger} from './config/logger.js';

import ProductManager from './src/dao/ProductManager.js';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import viewsRouter from './src/routes/views.js';
import CartManager from './src/dao/CartManager.js';
import sessionRouter from './src/routes/session.js';
import emailRouter from './src/routes/emails.js';
import smsRouter from './src/routes/sms.js';
import mockingRouter from './src/mocking/mockRouter.js';




/*
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error('Missing GitHub OAuth configuration');
  process.exit(1); 
}
*/
const app = express();
const PORT = ENV_CONFIG.PUERTO || 8080;

const mongoUrl = ENV_CONFIG.DATABASE_URL;
const sessionSecret = ENV_CONFIG.SECRET_KEY || 'S3CR3T'

app.use(addLogger);
//Config sessions and passport
app.use(session({
  secret: sessionSecret, 
  resave:false,
  saveUninitialized:false,
  cookie: { secure: false },
  store:MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: "sessions",
    mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
    ttl:10000
  }),
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);
export const io = new Server(server);

//servidor
app.listen(PORT, () => {
  devLogger.info(`Servidor iniciado en el puerto ${PORT}`);
});
// Middleware para el manejo de JSON en el body
app.use(express.json());


// Configura Handlebars como motor de plantillas
const PM = new ProductManager();
const CM = new CartManager();

app.set("views", __dirname + "/src/views"),
app.engine('handlebars', expressHandlebars.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars");

// Especifica la ubicación de las vistas
//app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'src', 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

// routers de productos y carritos. rutas
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionRouter);
app.use("/", viewsRouter);
app.use('/email', emailRouter);
app.use('/sms', smsRouter);
app.use('/mockingproducts', mockingRouter);
app.use("/loggerTest", loggerRouter)




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

