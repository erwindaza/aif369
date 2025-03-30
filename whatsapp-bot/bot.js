const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});

client.on('qr', qr => {
    console.log('Escanea el QR desde WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot conectado y listo con IA (Ollama)!');
});

client.on('message', async message => {
    console.log("📥 Mensaje recibido:", message.body);

    try {
        const response = await axios.post('http://backend:8000/chat', {
            prompt: message.body
        });

        const botResponse = response.data.respuesta;

        console.log("🤖 Respuesta generada:", botResponse);

        message.reply(botResponse);
    } catch (error) {
        console.error("⚠️ Error al conectar con API FastAPI:", error);
        message.reply('⚠️ Error en conexión con AI Factory.');
    }
});

client.initialize();

