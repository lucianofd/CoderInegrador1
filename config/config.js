import dotenv from 'dotenv';
import { Command } from "commander";
 
const program = new Command();

program
  .option("-p <port>", "Puerto del servidor", 9090)
  .option("--mode <mode>", "Modo de trabajo", "development")
  .parse(process.argv);

const environment = program.opts().mode;

dotenv.config({
  path:
    environment === "production"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export const ENV_CONFIG = {
PUERTO: 8000,
environment: environment,
DATABASE_URL: process.env.DATABASE_URL,
SECRET_KEY: process.env.SECRET_KEY_SESSION,
JWT_SECRET: process.env.JWT_SECRET,
CLIENT_ID_GITHUB: process.env.GITHUB_CLIENT,
CLIENT_SECRET_GITHUB: process.env.GITHUB_SECRET,
ADMIN_EMAIL: process.env.ADMIN_EMAIL,
ADMIN_PASSWORD : process.env.ADMIN_PASSWORD,
//
persistence: process.env.PERSISTENCE,
//Twilio
EMAIL_USER : process.env.EMAIL_USER,
EMAIL_PASS : process.env.EMAIL_PASS,
TWILIO_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
TWILIO_AUTH_TOKEN : process.env.TWILIO_AUTH_TOKEN,
TWILIO_SMS_NUMBER : process.env.TWILIO_SMS_NUMBER,

};