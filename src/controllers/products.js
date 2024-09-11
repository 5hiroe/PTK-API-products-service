import ProductService from '../services/products.js'
import ProductValidator from '../validators/product.js'
const ProductServiceInstance = new ProductService()
const ProductValidatorInstance = new ProductValidator()

export async function getAllProducts (req, res) {
    const products = await ProductServiceInstance.getAll()
    return res.status(200).json({ products })
}

export async function getProduct (req, res) {
    const { params } = req
    ProductValidatorInstance.validate(params, ProductValidatorInstance.getProduct)
    const { productId } = req.params
    const product = await ProductServiceInstance.get({ productId })
    return res.status(200).json({ product })
}

export async function createProduct (req, res) {
    const { body } = req
    ProductValidatorInstance.validate(body, ProductValidatorInstance.createProduct)
    const { fields } = req.body
    const product = await ProductServiceInstance.create({ fields })
    return res.status(200).json({ product })
}

export async function updateProduct (req, res) {
    const { body, params } = req
    ProductValidatorInstance.validate(body, ProductValidatorInstance.updateProduct)
    ProductValidatorInstance.validate(params, ProductValidatorInstance.updateProductId)
    const { productId } = req.params
    const { fields } = req.body
    const product = await ProductServiceInstance.update({ productId, fields })
    return res.status(200).json({ product })
}

export async function removeProduct (req, res) {
    const { params } = req
    ProductValidatorInstance.validate(params, ProductValidatorInstance.removeProduct)
    const { productId } = req.params
    await ProductServiceInstance.remove({ productId })
    return res.status(200).json({ message: 'Produit supprimé.' })
}