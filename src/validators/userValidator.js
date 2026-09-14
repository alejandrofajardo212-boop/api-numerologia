import { check, param } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';

export const validarRegistro = [
  check('name', 'El nombre es obligatorio').trim().notEmpty().isLength({ max: 100 }),
  check('email', 'Ingrese un correo electrónico válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validarCampos
];

export const validarLogin = [
  check('email', 'Ingrese un correo electrónico válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña es obligatoria').notEmpty(),
  validarCampos
];

export const validarIdUsuario = [
  param('id', 'No es un ID válido de Mongo').isMongoId(),
  validarCampos
];