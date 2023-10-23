import 'dotenv/config';

export const PUERTO= 8000
export const DATABASE_URL= process.env.DATABASE_URL
export const SECRET_KEY= process.env.SECRET_KEY_SESSION
export const JWT_SECRET= process.env.JWT_SECRET
export const CLIENT_ID_GITHUB= process.env.GITHUB_CLIENT
export const CLIENT_SECRET_GITHUB= process.env.GITHUB_SECRET
export const ADMIN_EMAIL= process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
//Twilio
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;