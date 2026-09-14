import { check, param } from 'express-validator';
import { validarCampos } from '../middlewares/validarCampos.js';

export const validarGenerarLectura = [
  check('reading_type', 'El tipo de lectura no es válido')
    .optional()
    .isString()
    .trim()
    .isIn(['general', 'amor', 'trabajo', 'dinero', 'salud'])
    .withMessage('Opciones válidas: general, amor, trabajo, dinero, salud'),
  validarCampos
];

export const validarIdLectura = [
  param('id', 'No es un ID válido de Mongo').isMongoId(),
  validarCampos
];