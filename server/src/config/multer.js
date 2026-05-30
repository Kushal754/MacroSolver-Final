// server/src/config/multer.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

// Configuración del almacenamiento profesional Req #6
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guardamos las imágenes en la carpeta 'uploads' que creamos
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Generamos un nombre único: UUID + extensión original (ej: 123e4567...jpg)
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('❌ Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WEBP).'), false); // Rechazar
  }
};

// Inicializamos multer con la configuración profesional
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite profesional de 5MB por imagen Req #6
  }
});

module.exports = upload;