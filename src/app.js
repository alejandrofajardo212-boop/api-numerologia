import express from 'express';
import cors from 'cors';
import { auditLogger } from './middlewares/auditMiddleware.js';
import { verifyToken } from './middlewares/authMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import numerologyRoutes from './routes/numerologyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import compatibilityRoutes from './routes/compatibilityRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de auditoría global
app.use(auditLogger);

app.use('/api/v1/users', userRoutes);

// 1. RUTAS PÚBLICAS (No piden token)
app.use('/api/v1/auth', authRoutes);

// 2. MIDDLEWARE PROTECTOR (Cualquier ruta abajo de esta línea EXIGE Token JWT)
app.use(verifyToken);

// 3. RUTAS PRIVADAS / PROTEGIDAS
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/readings', readingRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);

export default app;