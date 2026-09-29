import { Router } from 'express';
import { checkCompatibility } from '../controllers/compatibilityController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.post('/check', verifyToken, checkCompatibility);

export default router;