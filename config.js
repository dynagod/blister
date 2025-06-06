import dotenv from "dotenv";

dotenv.config({path: './.env'});

export default {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    cohereKey: process.env.COHERE_AI_KEY
}