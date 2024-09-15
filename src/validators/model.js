import Joi from 'joi'

export const product = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(100).required(),
    price: Joi.number().required(),
    stockQuantity: Joi.number().required(),
})