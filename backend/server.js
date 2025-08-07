// backend/server.js
require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5173', // Tu frontend en desarrollo
  'https://info-car-front-end.onrender.com' // ¡IMPORTANTE! Reemplaza esto con la URL de tu frontend
];

// Configura CORS para permitir peticiones desde tu frontend
app.use(cors({
    origin: allowedOrigins
}));

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Endpoint para generar la firma
app.get('/api/sign-upload', (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    // Opcional: puedes añadir un `folder` para organizar tus subidas
    const params_to_sign = {
        timestamp: timestamp,
        folder: 'info-car-vehicles'
    };

    try {
        const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_API_SECRET);
        res.status(200).json({
            signature,
            timestamp
        });
    } catch (error) {
        console.error("Error signing upload request", error);
        res.status(500).json({ error: 'Failed to sign upload request' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor de firmas de Cloudinary corriendo en el puerto ${port}`);
});
