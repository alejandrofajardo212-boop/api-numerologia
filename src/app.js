require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.js');

const app = express();

// Middleware para interpretar peticiones en formato JSON
app.use(express.json());

// Conectar a la base de datos MongoDB
connectDB();

// Ruta base de prueba
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API de Numerología en funcionamiento' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});