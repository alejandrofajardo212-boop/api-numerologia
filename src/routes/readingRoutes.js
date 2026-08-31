import { Router } from 'express';
import { generateReading, getHistory } from '../controllers/readingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.post('/generate', verifyToken, generateReading);
router.get('/history', verifyToken, getHistory);

export default router;