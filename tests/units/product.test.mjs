import { strict as assert } from 'assert';
import sinon from 'sinon';
import ProductService from '../../src/services/products.js';
import Product from '../../src/models/product.js';
import mongoose from 'mongoose';

describe('Product Model', function() {
    it('should validate a product model successfully', function() {
        const productData = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            stockQuantity: 10
        };
        const product = new Product(productData);
        assert.strictEqual(product.name, 'Product 1');
        assert.strictEqual(product.description, 'Description 1');
        assert.strictEqual(product.price, 100);
        assert.strictEqual(product.stockQuantity, 10);
    });
});

describe('Product Service', function() {
    let productService, saveStub, findStub, findByIdStub, findByIdAndUpdateStub, findByIdAndDeleteStub;

    before(function() {
        productService = new ProductService();
    });

    beforeEach(function() {
        saveStub = sinon.stub(Product.prototype, 'save');
        findStub = sinon.stub(Product, 'find');
        findByIdStub = sinon.stub(Product, 'findById');
        findByIdAndUpdateStub = sinon.stub(Product, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(Product, 'findByIdAndDelete');
    });

    afterEach(function() {
        sinon.restore();
    });

    describe('Create Product', function() {
        it('should save a product successfully', async function() {
            const productData = {
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                stockQuantity: 10
            };
            const product = new Product(productData);
            saveStub.resolves(product);

            const savedProduct = await productService.create({ fields: productData });

            assert.deepEqual(savedProduct.name, 'Product 1');
            assert.deepEqual(savedProduct.description, 'Description 1');
            assert.deepEqual(savedProduct.price, 100);
            assert.deepEqual(savedProduct.stockQuantity, 10);
            assert(saveStub.calledOnce);
        });
    });

    describe('Read Product', function() {
        it('should get all products successfully', async function() {
            const products = [
                { name: 'Product 1', description: 'Description 1', price: 100, stock_quantity: 10 },
                { name: 'Product 2', description: 'Description 2', price: 200, stock_quantity: 20 }
            ];
            findStub.resolves(products);

            const fetchedProducts = await productService.getAll();

            assert.deepEqual(fetchedProducts, products);
            assert(findStub.calledOnce);
        });

        it('should get a product by id successfully', async function() {
            const product = { name: 'Product 1', description: 'Description 1', price: 100, stock_quantity: 10 };
            findByIdStub.resolves(product);

            const fetchedProduct = await productService.get({ productId: new mongoose.Types.ObjectId() });

            assert.deepEqual(fetchedProduct, product);
            assert(findByIdStub.calledOnce);
        });

        it('should throw NotFound if product does not exist', async () => {
            const productId = 'nonExistingProductId'; // Un ID de produit qui n'existe pas
            
            const productService = new ProductService();
    
            try {
                await productService.get({ productId });
                throw new Error('Test should have thrown NotFound');
            } catch (error) {
                // expect(error).to.be.instanceOf(NotFound);
                assert.strictEqual(error.message, 'Produit introuvable.');
                
            }
        });
    });

    describe('Update Product', function() {
        it('should update a product successfully', async function() {
            const product = { name: 'Product 1', description: 'Updated Description', price: 150, stock_quantity: 15 };
            findByIdAndUpdateStub.resolves(product);

            const updatedProduct = await productService.update({
                productId: new mongoose.Types.ObjectId(),
                fields: { description: 'Updated Description', price: 150, stock_quantity: 15 }
            });

            assert.deepEqual(updatedProduct.description, 'Updated Description');
            assert.deepEqual(updatedProduct.price, 150);
            assert.deepEqual(updatedProduct.stock_quantity, 15);
            assert(findByIdAndUpdateStub.calledOnce);
        });

        it('should throw NotFound error when updating a non-existent product', async function() {
            findByIdAndUpdateStub.resolves(null);

            try {
                await productService.update({
                    productId: new mongoose.Types.ObjectId(),
                    fields: { description: 'Updated Description', price: 150, stock_quantity: 15 }
                });
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, 'Produit introuvable.');
            }
        });
    });

    describe('Delete Product', function() {
        it('should delete a product successfully', async function() {
            const product = { name: 'Product 1', description: 'Description 1', price: 100, stock_quantity: 10 };
            findByIdAndDeleteStub.resolves(product);

            await productService.remove({ productId: new mongoose.Types.ObjectId() });

            assert(findByIdAndDeleteStub.calledOnce);
        });

        it('should throw NotFound error when deleting a non-existent product', async function() {
            findByIdAndDeleteStub.resolves(null);

            try {
                await productService.remove({ productId: new mongoose.Types.ObjectId() });
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, 'Produit introuvable.');
            }
        });
    });
});
