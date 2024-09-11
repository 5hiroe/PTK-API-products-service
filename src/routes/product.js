import express from 'express'
import * as products from '../controllers/products.js'

const router = express.Router()

router.get('/', products.getAllProducts)
router.get('/:productId', products.getProduct)
router.post('/', products.createProduct)
router.put('/:productId', products.updateProduct)
router.delete('/:productId', products.removeProduct)

export default router;