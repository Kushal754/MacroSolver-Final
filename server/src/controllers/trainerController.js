const OpenAI = require('openai');

// Usamos la misma conexión a GitHub Models que en el MacroSolver
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateRoutine = async (req, res) => {
  try {
    const { objective, location, duration } = req.body;

    if (!objective || !location || !duration) {
      return res.status(400).json({ error: 'Faltan parámetros para generar la rutina.' });
    }

    console.log(`📡 Backend: Petición recibida para rutina - Objetivo: ${objective}, Lugar: ${location}, Tiempo: ${duration}`);

    const systemPrompt = `Eres un Entrenador Personal de élite e Inteligencia Artificial.
    Tu objetivo es crear una rutina de entrenamiento adaptada EXACTAMENTE a los siguientes parámetros del usuario:
    - Objetivo: ${objective}
    - Lugar de entrenamiento: ${location}
    - Tiempo disponible: ${duration}

    Reglas:
    - Si el lugar es "Casa (Sin material)", no incluyas ejercicios con pesas o máquinas.
    - Ajusta el volumen (número de ejercicios y series) para que encaje de forma realista en el "Tiempo disponible".
    
    Responde EXCLUSIVAMENTE con un objeto JSON válido que siga exactamente esta estructura, sin texto adicional:
    {
      "title": "Nombre épico de la rutina (ej. Circuito Metabólico — Full Body)",
      "tag": "Etiqueta corta (ej. Circuito metabólico, Fuerza, HIIT, Recuperación)",
      "description": "Una breve explicación de 2 líneas de por qué esta rutina sirve para su objetivo y lugar en el tiempo dado.",
      "exercises": [
        {
          "name": "Nombre del ejercicio",
          "reps": "Series y repeticiones (ej. 4 × 20 reps o 3 × 45 seg)",
          "rest": "Tiempo de descanso exacto (ej. 45 seg descanso)"
        }
      ]
    }`;

    console.log("💪 Diseñando rutina con GPT-4o...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Genera mi rutina de hoy según mi configuración." }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const routineData = JSON.parse(response.choices[0].message.content);
    console.log("✅ Rutina generada con éxito:", routineData.title);

    res.json(routineData);

  } catch (error) {
    console.error('❌ Error interno generando la rutina con IA:', error);
    res.status(500).json({ error: 'Fallo al procesar la solicitud con el Entrenador IA.' });
  }
};