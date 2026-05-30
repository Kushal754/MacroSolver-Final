// server/src/services/openaiService.js
const OpenAI = require('openai');

// Inicializamos el cliente de OpenAI apuntando al punto de enlace de GitHub Models
const openai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN, // Usamos el token de GitHub como clave de API
  baseURL: process.env.GITHUB_MODELS_ENDPOINT, // Apuntamos a la URL de inferencia de GitHub
});

// Exportamos la instancia para usarla en los controladores
module.exports = openai;