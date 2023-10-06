//No usado
//Correr en forma independiente

const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Verifica si ya existe una clave secreta en el archivo .env
if (!process.env.JWT_SECRET) {
  // Genera una clave secreta aleatoria de 256 bits
  const secretKey = crypto.randomBytes(32).toString('hex');
  console.log('Clave secreta generada:', secretKey);

  // Guarda la clave en el archivo .env
  fs.writeFileSync('.env', `JWT_SECRET=${secretKey}\n`, { flag: 'a' });

  console.log('Clave secreta almacenada en el archivo .env');
} else {
  console.log('La clave secreta ya está configurada en el archivo .env');
}

