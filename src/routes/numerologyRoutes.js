import { Router } from 'express';
import { calculateProfile, getProfile } from '../controllers/numerologyController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.post('/calculate', verifyToken, calculateProfile);
router.get('/profile', verifyToken, getProfile);

export default router;