import { body } from 'express-validator';

export const adminAreaValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
];