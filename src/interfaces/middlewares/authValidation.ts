import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula'),
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];
