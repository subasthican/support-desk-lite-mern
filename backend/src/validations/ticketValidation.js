const Joi = require("joi");

const createTicketSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(5000).required(),
  priority: Joi.string().valid("low", "medium", "high").required(),
  tags: Joi.array().items(Joi.string()).optional()
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .required()
});

module.exports = {
  createTicketSchema,
  updateStatusSchema
};