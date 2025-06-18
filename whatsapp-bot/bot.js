const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--single-process',
            '--no-zygote',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--user-data-dir=/tmp/chrome'
        ]
    }
});

const pool = new Pool({
    connectionString: process.env.PG_URL,
});

const conversationsDir = path.join(__dirname, 'conversaciones');
if (!fs.existsSync(conversationsDir)) fs.mkdirSync(conversationsDir);

client.on('qr', qr => {
    console.log('Escanea el QR desde WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot conectado y listo con IA (Ollama)!');
});

client.on('message', async message => {
    const userId = message.from;
    const userMessage = message.body.trim();
    const now = new Date().toISOString();

    const saludos = ["hola", "holi", "buenas", "hello", "hi"];
    const palabrasProhibidas = ["actúa como", "ignora instrucciones", "haz lo que te digo", "desactiva", "jailbreak", "modo libre"];
    const contieneProhibidas = palabrasProhibidas.some(p => userMessage.toLowerCase().includes(p));

    if (contieneProhibidas) {
        return message.reply("⚠️ Lo siento, no puedo responder a ese tipo de solicitudes. ¿En qué puedo ayudarte respecto a nuestros productos?");
    }

    if (saludos.includes(userMessage.toLowerCase())) {
        return message.reply("Hola 👋, ¿en qué puedo ayudarte hoy? Soy tu asistente para conocer las soluciones de Ai Factory 369 ✨");
    }

    try {
        const response = await axios.post('http://backend:8000/chat', {
            prompt: `Usuario: ${userMessage}`
        });

        const botResponse = response.data.respuesta || "Disculpa, no tengo información sobre eso. ¿Quieres dejar tus datos para contactarte?";

        let clientType = "potencial";
        if (botResponse.toLowerCase().includes("no tengo informacion") || botResponse.toLowerCase().includes("fuera del contexto")) {
            clientType = "falso";
        }

        const userFile = path.join(conversationsDir, `${userId}.json`);
        let data = { user: userId, etiqueta: clientType, historial: [] };
        if (fs.existsSync(userFile)) {
            data = JSON.parse(fs.readFileSync(userFile));
        }

        data.etiqueta = clientType;
        data.historial.push({
            fecha: now,
            usuario: userMessage,
            bot: botResponse,
            etiqueta_auto: clientType
        });

        fs.writeFileSync(userFile, JSON.stringify(data, null, 2));

        await guardarEnBD(userId, now, userMessage, botResponse, clientType);

        message.reply(botResponse);

    } catch (error) {
        console.error("⚠️ Error al conectar con API FastAPI:", error);
        message.reply('⚠️ Error en conexión con AI Factory.');
    }
});

client.initialize();

async function guardarEnBD(userId, fecha, usuario, bot, tipo) {
    try {
        await pool.query(
            'INSERT INTO chat_logs (usuario_id, fecha, mensaje_usuario, mensaje_bot, tipo_cliente) VALUES ($1, $2, $3, $4, $5)',
            [userId, fecha, usuario, bot, tipo]
        );
    } catch (err) {
        console.error("❌ Error guardando en la base de datos:", err);
    }
}