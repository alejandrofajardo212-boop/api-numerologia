import express from 'express';
import cors from 'cors';
import { auditLogger } from './middlewares/auditMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import numerologyRoutes from './routes/numerologyRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import compatibilityRoutes from './routes/compatibilityRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware global de auditoría (registra métodos, rutas, status)
app.use(auditLogger);

// Montaje de Endpoints v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/numerology', numerologyRoutes);
app.use('/api/v1/readings', readingRoutes);
app.use('/api/v1/compatibility', compatibilityRoutes);

export default app;