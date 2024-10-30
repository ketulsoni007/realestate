import { body } from 'express-validator';

export const adminSubModuleValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('icon').notEmpty().withMessage('Icon is required'),
    body('module').notEmpty().withMessage('Module is required'),
];