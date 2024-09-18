import ProductModel from '../models/product.js';
import { NotFound } from '../globals/errors.js';
import amqp from 'amqplib';

export default class ProductService {
    constructor () {
        if (ProductService.instance instanceof ProductService) {
            return ProductService.instance;
        }
        this.rabbitmqChannel = null; // Stocker le canal RabbitMQ ici
        this.initRabbitMQ(); // Initialiser RabbitMQ

        // Object.freeze(this);
        ProductService.instance = this;
    }

    // Fonction pour se connecter à RabbitMQ et créer un canal
    async initRabbitMQ() {
        try {
            const connection = await amqp.connect('http://51.75.140.58/rabbitmq/'); // Connexion à RabbitMQ
            this.rabbitmqChannel = await connection.createChannel(); // Création d'un canal
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
        }
    }

    // Fonction pour envoyer un message à une file RabbitMQ
    async sendToQueue(queue, message) {
        if (!this.rabbitmqChannel) {
            console.error('RabbitMQ channel is not available');
            return;
        }
        await this.rabbitmqChannel.assertQueue(queue, { durable: true });
        this.rabbitmqChannel.sendToQueue(queue, Buffer.from(message));
        console.log(`Message sent to ${queue}: ${message}`);
    }

    /**
     * Get all products from db.
     */
    async getAll () {
        const products = await ProductModel.find();
        // Envoyer un message à RabbitMQ après récupération de tous les produits
        const message = JSON.stringify({ action: 'getAll', products });
        await this.sendToQueue('productQueue', message);
        return products;
    }

    /**
     * Get a product by his id
     * 
     * @param {ObjectId} productId
     */
    async get ({ productId }) {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }
        // Envoyer un message à RabbitMQ après récupération du produit
        const message = JSON.stringify({ action: 'get', productId, product });
        await this.sendToQueue('productQueue', message);
        return product;
    }

    /**
     * Create a product
     * 
     * @param {Object} fields
     */
    async create ({ fields }) {
        const product = new ProductModel(fields);
        await product.save();
        
        // Envoyer un message à RabbitMQ après la création du produit
        const message = JSON.stringify({ action: 'create', productId: product._id, fields });
        await this.sendToQueue('productQueue', message);

        return product;
    }

    /**
     * Update a product
     * 
     * @param {ObjectId} productId
     * @param {Object} fields
     */
    async update ({ productId, fields }) {
        const product = await ProductModel.findByIdAndUpdate(productId, fields, { new: true });
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }

        // Envoyer un message à RabbitMQ après la mise à jour du produit
        const message = JSON.stringify({ action: 'update', productId, fields });
        await this.sendToQueue('productQueue', message);

        return product;
    }

    /**
     * Delete a product
     * 
     * @param {ObjectId} productId
     */
    async remove ({ productId }) {
        const product = await ProductModel.findByIdAndDelete(productId);
        if (!product) {
            throw new NotFound('Produit introuvable.');
        }

        // Envoyer un message à RabbitMQ après la suppression du produit
        const message = JSON.stringify({ action: 'delete', productId });
        await this.sendToQueue('productQueue', message);
    }
}
