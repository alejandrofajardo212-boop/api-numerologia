import { Router } from 'express';
import { 
  generateReading, 
  getHistory, 
  getReadingById, 
  deleteReading 
} from '../controllers/readingController.js';

import { 
  validarGenerarLectura, 
  validarIdLectura 
} from '../validators/readingValidator.js';

const router = Router();

router.post('/', [validarGenerarLectura], generateReading);
router.get('/', getHistory);
router.get('/:id', [validarIdLectura], getReadingById);
router.delete('/:id', [validarIdLectura], deleteReading);

export default router;