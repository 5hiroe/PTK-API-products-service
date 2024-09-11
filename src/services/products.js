import ProductModel from '../models/product.js'
import { NotFound } from '../globals/errors.js'

export default class ProductService {
    constructor () {
        if (ProductService.instance instanceof ProductService) {
            return ProductService.instance
        }
        Object.freeze(this)
        ProductService.instance = this
    }

    /**
     * Get all products from db.
     */
    async getAll () {
        const products = await ProductModel.find()
        return products
    }

    /**
     * Get a product by his id
     * 
     * @param {ObjectId} productId
     */
    async get ({ productId }) {
        const product = await ProductModel.findById(productId)
        return product
    }

    /**
     * Create a product
     * 
     * @param {Object} fields
     */
    async create ({ fields }) {
        const product = new ProductModel(fields)
        await product.save()
        return product
    }

    /**
     * Update a product
     * 
     * @param {ObjectId} productId
     * @param {Object} fields
     */
    async update ({ productId, fields }) {
        const product = await ProductModel.findByIdAndUpdate(productId, fields, { new: true })
        if (!product) {
            throw new NotFound('Produit introuvable.')
        }
        return product
    }

    /**
     * Delete a product
     * 
     * @param {ObjectId} productId
     */
    async remove ({ productId }) {
        const product = await ProductModel.findByIdAndDelete(productId)
        if (!product) {
            throw new NotFound('Produit introuvable.')
        }
    }
}