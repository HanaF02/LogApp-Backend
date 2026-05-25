import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const validateCreateApp = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Application name is required")
    .matches(/^\S+$/)
    .withMessage("Application name cannot contain spaces")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  validate,
];

export const validatePostLog = [
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["INFO", "WARN", "ERROR"])
    .withMessage("Level must be INFO, WARN, or ERROR"),
  validate,
];
