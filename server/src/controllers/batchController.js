const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateBatchPlan = async (req, res) => {
  try {
    const { baseIngredient, allIngredients } = req.body;

    if (!baseIngredient) {
      return res.status(400).json({ error: 'Debes seleccionar un ingrediente base.' });
    }

    console.log(`📡 Backend: Generando plan de Batch Cooking para la base: ${baseIngredient.name}`);

    // Preparamos la lista de lo que hay en la despensa para que la IA sepa qué complementos usar
    const pantryList = allIngredients.map(ing => `${ing.name} (${ing.quantityInStock}${ing.unit})`).join(', ');

    const systemPrompt = `Eres un Chef experto en nutrición y "Batch Cooking" (Meal Prep).
    El usuario va a cocinar una gran cantidad de un ingrediente base el domingo: "${baseIngredient.name}".
    
    Tu objetivo es diseñar un menú de comidas para 5 días (de Lunes a Viernes). 
    En TODOS los platos, el ingrediente principal debe ser "${baseIngredient.name}". Para darle variedad a la semana, combínalo creativamente con el resto de ingredientes que el usuario tiene en su despensa: ${pantryList}.
    Puedes asumir que tiene agua, sal, pimienta, aceite y especias básicas.
    
    Responde EXCLUSIVAMENTE con un objeto JSON válido que siga exactamente esta estructura, sin texto adicional:
    {
      "days": [
        {
          "day": "LUNES",
          "dishName": "Nombre creativo del plato",
          "calories": 0,
          "protein": 0,
          "carbs": 0
        },
        {
          "day": "MARTES",
          "dishName": "...",
          "calories": 0,
          "protein": 0,
          "carbs": 0
        }
        // ... (Genera hasta el VIERNES)
      ],
      "summary": {
        "totalCalories": 0,
        "totalProtein": 0,
        "totalCarbs": 0,
        "estimatedCost": 0.00
      }
    }`;

    console.log("👨‍🍳 Cocinando plan semanal con GPT-4o...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Genera mi plan de Batch Cooking usando ${baseIngredient.name} como base.` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const planData = JSON.parse(response.choices[0].message.content);
    console.log("✅ Plan de Batch Cooking generado con éxito.");

    res.json(planData);

  } catch (error) {
    console.error('❌ Error interno en Batch Cooking con IA:', error);
    res.status(500).json({ error: 'Fallo al procesar el plan con Inteligencia Artificial.' });
  }
};