// singleton
import mongoose from "mongoose";
import { ENV_CONFIG } from "./config.js";
import { devLogger } from "./logger.js";

class DatabaseSingleton {
  constructor() {
    if (!DatabaseSingleton.instance) {
      this._connect();
      DatabaseSingleton.instance = this;
    }

    return DatabaseSingleton.instance;
  }

  _connect() {
    const databaseURL = ENV_CONFIG.DATABASE_URL;

    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose
      .connect(databaseURL, dbOptions)
      .then(() => {
        
        devLogger.info('Conectado a MongoDB');
      })
      .catch((err) => {
        devLogger.error("Conexion Db Fallida" + err)
        throw new Error("Database connection failed: " + err);
      });
``
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
  }

  static getInstance() {
    return DatabaseSingleton.instance || new DatabaseSingleton();
  }
}

export default DatabaseSingleton;


