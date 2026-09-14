import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  deleteUser 
} from '../controllers/userController.js';

import { 
  validarRegistro, 
  validarLogin, 
  validarIdUsuario 
} from '../validators/userValidator.js';

const router = Router();

// Rutas de autenticación y gestión
router.post('/register', [validarRegistro], registerUser);
router.post('/login', [validarLogin], loginUser);
router.get('/', getUsers);
router.delete('/:id', [validarIdUsuario], deleteUser);

export default router;