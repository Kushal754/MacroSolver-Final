const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Exportamos la instancia para usarla en los controladores
module.exports = openai;