import { body } from 'express-validator';

export const adminCountryValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('code').notEmpty().withMessage('Code is required'),
];