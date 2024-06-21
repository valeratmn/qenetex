import { body, param } from "express-validator";

export const registerUserValidator = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const loginUserValidator = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().isLength({ min: 8 }).withMessage('Password is required')
];


export const updateUserRoleValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  body("role").isInt({ min: 0, max: 1 }).withMessage("Role must be 0 or 1"),
];
