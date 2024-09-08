import express from 'express';
import logger from '../middlewares/logger.js';
import Product from '../models/product.js';
import { checkValidObjectId } from '../middlewares/validObjectId.js';
import { isValidPrice } from '../middlewares/validPrice.js';
import { isValidQuantity } from '../middlewares/validQuantity.js';

const router = express.Router();

router.use(logger);

router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
    }
  });

router.get('/:id', checkValidObjectId, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/', isValidPrice, isValidQuantity, async (req, res) => {
    const { name, description, price, stock_quantity } = req.body;
    if (!name || !description || !price || !stock_quantity) {
        return res.status(400).json({ error: 'Le nom, la description, le prix et la quantité en stock sont requis' });
    }

    try {
        const newProduct = new Product({ name, description, price, stock_quantity });
        await newProduct.save();
        res.status(201).json({ message: 'Produit créé', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la commande', error });
    }
});

router.put('/:id', checkValidObjectId, isValidPrice, isValidQuantity, async (req, res) => {
    const { name, description, price, stock_quantity }= req.body;
    if (!name || !description || !price || !stock_quantity) {
        return res.status(400).json({ error: 'Le nom, la description, le prix et la quantité en stock sont requis' });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, stock_quantity },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        
        res.status(200).json({ message: 'Produit modifié', product: product });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de la commande', error });
    }
});

router.delete('/:id', checkValidObjectId, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé', product: product });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

export default router;