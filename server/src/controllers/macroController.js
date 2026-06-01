const OpenAI = require('openai');

// Blindaje de conexión: Forzamos la URL a GitHub Models al igual que en el escáner
const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, texture } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'No se han proporcionado ingredientes.' });
    }

    console.log(`📡 Backend: Petición recibida para generar receta con ${ingredients.length} ingredientes.`);

    // 1. Preparamos el inventario exacto para que la IA sepa qué tiene en la nevera
    const ingredientsList = ingredients.map(ing => 
      `- ${ing.name} (Macros por 100g: ${ing.calories}kcal, P:${ing.protein}g, C:${ing.carbs}g, G:${ing.fat}g)`
    ).join('\n');

    // 2. Si el usuario ha pedido una textura específica (Salvavidas de Antojos), se lo exigimos a la IA
    const texturePrompt = texture 
      ? `\nATENCIÓN: El usuario ha solicitado que el plato final tenga una textura o estilo: "${texture}". Adapta los métodos de cocción (ej. horno, sartén, crudo) para lograr este resultado.` 
      : '';

    // 3. El Prompt del Sistema (Ingeniería de Prompts estricta para JSON)
    const systemPrompt = `Eres un Chef de alta cocina experto en nutrición y programación lineal. 
    Tu objetivo es crear UNA receta óptima y deliciosa utilizando ÚNICAMENTE una selección lógica de los ingredientes proporcionados. 
    Aparte de los ingredientes dados, SOLO puedes asumir que el usuario tiene agua, sal, pimienta y especias básicas secas.
    ${texturePrompt}

    IMPORTANTE: Calcula las cantidades exactas a usar de cada ingrediente para crear un plato equilibrado de una sola porción y suma los macros totales de la receta en base a esas cantidades. Invéntate un precio estimado realista para "estimatedCost" en euros (ej: 1.20).
    
    Responde EXCLUSIVAMENTE con un objeto JSON válido que siga exactamente esta estructura, sin texto adicional ni formateo Markdown fuera del JSON:
    {
      "title": "Nombre creativo del plato",
      "description": "Una breve descripción apetitosa de una línea.",
      "totals": {
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "cost": 0.00
      },
      "usedIngredients": [
        { "name": "Nombre exacto del ingrediente", "amount": 0, "unit": "g", "estimatedCost": 0.00 }
      ],
      "steps": [
        "Paso 1: ...",
        "Paso 2: ..."
      ]
    }`;

    console.log("🧠 Pensando receta con GPT-4o a través de GitHub Models...");

    // 4. Llamada real a la IA
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Diseña mi comida con lo siguiente:\n${ingredientsList}` }
      ],
      response_format: { type: "json_object" }, // Forzamos JSON estricto
      temperature: 0.7 
    });

    const aiAnalysisRaw = response.choices[0].message.content;
    const recipeData = JSON.parse(aiAnalysisRaw);

    console.log("✅ Receta generada con éxito:", recipeData.title);

    // 5. Devolvemos la receta al frontend
    res.json(recipeData);

  } catch (error) {
    console.error('❌ Error interno generando la receta con IA:', error);
    res.status(500).json({ error: 'Fallo al procesar la solicitud con la Inteligencia Artificial.' });
  }
};