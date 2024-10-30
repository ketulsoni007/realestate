import { body } from 'express-validator';

export const adminModuleValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('icon').notEmpty().withMessage('Icon is required'),
];