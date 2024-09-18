import Validator from './validator.js'
import { product } from './model.js'
import Joi from 'joi'

export default class ProductValidator extends Validator {
    getProduct = Joi.object({
        productId: Joi.string().max(100).required()
    })

    createProduct = Joi.object({
        fields: product.required()
    })

    updateProduct = Joi.object({
        fields: product.required()
    })

    updateProductId = Joi.object({
        productId: Joi.string().max(100).required()
    })

    removeProduct = Joi.object({
        productId: Joi.string().max(100).required()
    })
}