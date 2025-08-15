import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import authController from "../controllers/authController.js";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

// Validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "teacher", "parent").default("student"),
  preferredLanguage: Joi.string().valid("en", "fr", "rw").default("en"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

// Validation middleware
const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details[0].message,
    });
  }
  req.body = value;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details[0].message,
    });
  }
  req.body = value;
  next();
};

const validateChangePassword = (req, res, next) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details[0].message,
    });
  }
  req.body = value;
  next();
};

// Routes
router.post(
  "/register",
  authLimiter,
  validateRegister,
  authController.register
);
router.post("/login", authLimiter, validateLogin, authController.login);
router.get("/me", auth, authController.getMe);
router.put("/profile", auth, authController.updateProfile);
router.put(
  "/change-password",
  auth,
  validateChangePassword,
  authController.changePassword
);
router.post("/refresh-token", auth, authController.refreshToken);
router.post("/logout", auth, authController.logout);

module.exports = router;
