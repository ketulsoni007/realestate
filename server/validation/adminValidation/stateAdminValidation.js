import { body } from 'express-validator';

export const adminStateValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('country').notEmpty().withMessage('Country is required'),
];