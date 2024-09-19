import ProductModel from '../models/product.js';
import { NotFound } from '../globals/errors.js';
import { sendToQueue } from '../configurations/rabbitmq.js';

export default class ProductService {
    constructor() {
        if (ProductService.instance instanceof ProductService) {
            return ProductService.instance;
        }

        // Object.freeze(this);
        ProductService.instance = this;
    }

    /**
     * Get all products from db.
     */
    async getAll() {
        const products = await ProductModel.find();
        const message = JSON.stringify({ action: 'getAll', products });
        await sendToQueue('productQueue', message); // Envoie du message à RabbitMQ
        return products;
    }

    /**
     * Get a product by its id
     * 
     * @param {ObjectId} productId
     */
    async get({ productId }) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }
        const message = JSON.stringify({ action: 'get', productId, product });
        await sendToQueue('productQueue', message); // Envoie du message à RabbitMQ
        return product;
    }

    /**
     * Create a product
     * 
     * @param {Object} fields
     */
    async create({ fields }) {
        const product = new ProductModel(fields);
        await product.save();
        
        const message = JSON.stringify({ action: 'create', productId: product._id, fields });
        await sendToQueue('productQueue', message); // Envoie du message à RabbitMQ

        return product;
    }

    /**
     * Update a product
     * 
     * @param {ObjectId} productId
     * @param {Object} fields
     */
    async update({ productId, fields }) {
        const product = await ProductModel.findByIdAndUpdate(productId, fields, { new: true });
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }

        const message = JSON.stringify({ action: 'update', productId, fields });
        await sendToQueue('productQueue', message); // Envoie du message à RabbitMQ

        return product;
    }

    /**
     * Delete a product
     * 
     * @param {ObjectId} productId
     */
    async remove({ productId }) {
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }

        const message = JSON.stringify({ action: 'delete', productId });
        await sendToQueue('productQueue', message); // Envoie du message à RabbitMQ
    }


    
}
