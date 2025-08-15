import Joi from "joi";

// Common validation schemas
const objectIdSchema = Joi.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "valid ObjectId"
);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default("createdAt"),
  order: Joi.string().valid("asc", "desc").default("desc"),
});

const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100),
  category: Joi.string(),
  level: Joi.string(),
  language: Joi.string().valid("en", "fr", "rw"),
  type: Joi.string(),
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details[0].message,
      });
    }
    req.body = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "Query validation error",
        details: error.details[0].message,
      });
    }
    req.query = value;
    next();
  };
};

export default {
  objectIdSchema,
  paginationSchema,
  searchSchema,
  validate,
  validateQuery,
};
