import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Conectar a MongoDB e iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Servidor listo escuchando en el puerto ${PORT}`);
  });
});