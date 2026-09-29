import { Router } from 'express';
import { 
  generateReading, 
  getHistory, 
  getReadingById, 
  updateReading,
  deleteReading 
} from '../controllers/readingController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

import { 
  validarGenerarLectura, 
  validarIdLectura 
} from '../validators/readingValidator.js';

const router = Router();

router.post('/', [authMiddleware, validarGenerarLectura], generateReading);
router.get('/', authMiddleware, getHistory);
router.get('/:id', [authMiddleware, validarIdLectura], getReadingById);
router.put('/:id', [authMiddleware, validarIdLectura], updateReading);
router.delete('/:id', [authMiddleware, validarIdLectura], deleteReading);

export default router;