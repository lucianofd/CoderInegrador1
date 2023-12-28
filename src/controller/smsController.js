import twilio from 'twilio';
import { ENV_CONFIG } from '../../config/config.js';

const twilioClient = twilio(ENV_CONFIG.TWILIO_ACCOUNT_SID, ENV_CONFIG.TWILIO_AUTH_TOKEN);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio.",
    from: ENV_CONFIG.TWILIO_SMS_NUMBER,
    to: "+54 11 6745 0559",
}

export const sendSMS = async (req, res) => {
    try {
        console.log("Enviando SMS using Twilio account.");
        console.log(twilioClient);
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({message: "Success!", payload: result});
    } catch (error) {
        console.error("Hubo un problema enviando el SMS usando Twilio.", error);
        res.status(500).send({error: error});
    }
}