const Joi = require('joi');

const createItemSchema = Joi.object({
  item_name: Joi.string().trim().min(1).max(100).required(),
  item_price: Joi.number().min(0).precision(2).required(),
  quantity: Joi.number().integer().min(1).required()
}).unknown(false);

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
}).unknown(false);

module.exports = {
  createItemSchema,
  updateQuantitySchema
};
