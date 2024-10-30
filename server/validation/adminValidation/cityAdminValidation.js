import { body } from 'express-validator';

export const adminCityValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('state').notEmpty().withMessage('State is required'),
];