import 'dotenv/config';
import mongoose from "mongoose";

const databaseURL = process.env.DATABASE_URL;
/*
mongoose.connect(databaseURL)
.then(()=>{
    console.log('Database connected');
})
.catch((err)=>{
      console.log('Database connection failed' + err);
})
*/

// Configuración de la conexión a la base de datos
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Conectar a la base de datos
mongoose.connect(databaseURL, dbOptions)
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        // Lanza una excepción para indicar un error crítico
        throw new Error('Database connection failed: ' + err);
    });

// Manejo de eventos de desconexión
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
});

