// server/src/controllers/pantryController.js
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai'); // Importación directa de la librería

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY
});

exports.scanPantryImage = async (req, res) => {
  try {
    console.log('📡 Backend: Petición POST /api/pantry/scan recibida...');

    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No se ha subido ninguna imagen.' });
    }

    const imagePath = req.file.path;
    console.log(`📸 Imagen recibida y guardada en: ${imagePath}`);

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mediaType = req.file.mimetype; // ej: image/jpeg

    const MODEL_NAME = "gpt-4o"; 

    console.log(`🧠 Iniciando análisis con IA Real (${MODEL_NAME}) a través de GitHub Models...`);
    
    // Usamos el cliente 'openai' blindado hacia Azure
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analiza esta imagen de una nevera o despensa. Identifica los ingredientes visibles y proporciona su información nutricional estimada (calorías, proteínas, carbohidratos, grasas) por cada 100g. Responde EXCLUSIVAMENTE en formato JSON estricto, sin texto adicional, siguiendo esta estructura de objeto: {\"ingredients\": [{\"name\": \"Nombre Ingrediente\", \"category\": \"Categoría\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fat\": 0, \"unit\": \"g\"}]}. Si no estás seguro de los macros, proporciona una estimación realista basada en bases de datos estándar." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mediaType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      // Forzamos respuesta JSON si el modelo lo soporta (gpt-4o lo soporta)
      response_format: { type: "json_object" }, 
    });

    console.log('✅ Análisis de IA completado.');

    // --- AQUÍ EMPIEZA LA LÓGICA NUEVA (EL CHIVATO Y EL BLINDAJE) ---
    console.log("📦 PAQUETE COMPLETO DE LA IA:\n", JSON.stringify(response, null, 2));

    const aiAnalysisRaw = response.choices[0].message.content;
    const finishReason = response.choices[0].finish_reason;
    
    if (aiAnalysisRaw === null) {
        throw new Error(`La IA devolvió null. Motivo de parada (finish_reason): ${finishReason}`);
    }
    // --- FIN DE LA LÓGICA NUEVA ---

    // La respuesta de la IA debe ser un JSON estricto según nuestro prompt.
    let detectedIngredients = [];
    try {
        const parsedResponse = JSON.parse(aiAnalysisRaw);
        detectedIngredients = parsedResponse.ingredients; // Extraemos el array del objeto { ingredients: [...] }

        if (!Array.isArray(detectedIngredients)) {
            throw new Error("La respuesta de la IA no contiene un array de ingredientes válido.");
        }

    } catch (parseError) {
        console.error('❌ Error parseando la respuesta JSON de la IA:', parseError);
        console.log('Respuesta cruda de la IA:', aiAnalysisRaw);
        throw new Error("Error al procesar los datos de la IA. La respuesta no era el JSON esperado.");
    }

    fs.unlinkSync(imagePath); 
    console.log('🗑️ Imagen temporal borrada.');

    // Devolvemos los ingredientes detectados y la ruta de la imagen
    res.json({
      status: 'success',
      message: 'Imagen analizada correctamente por la IA.',
      imagePath: `/uploads/${req.file.filename}`, 
      ingredients: detectedIngredients 
    });

  } catch (error) {
    console.error('❌ Backend Error en el escáner:', error.message || error);
    
    // Limpieza si hubo error: intentar borrar la imagen si existe
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Error crítico durante el análisis de la imagen.' 
    });
  }
};