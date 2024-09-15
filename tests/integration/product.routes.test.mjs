import request from 'supertest';
import express from 'express';
import router from '../../src/routes/product.js';
import sinon from 'sinon';
import ProductService from '../../src/services/products.js';
import { strict as assert } from 'assert';

const app = express();
app.use(express.json());
app.use('/products', router);

describe('Product Routes', function() {
  this.timeout(10000); // Augmente le délai d'exécution à 5000 ms (5 secondes)

  let productServiceStub;

  beforeEach(() => {
    productServiceStub = sinon.createStubInstance(ProductService);

    sinon.replace(ProductService.prototype, 'getAll', productServiceStub.getAll);
    sinon.replace(ProductService.prototype, 'get', productServiceStub.get);
    sinon.replace(ProductService.prototype, 'create', productServiceStub.create);
    sinon.replace(ProductService.prototype, 'update', productServiceStub.update);
    sinon.replace(ProductService.prototype, 'remove', productServiceStub.remove);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should get all products', async function() {
    const expectedProducts = [{
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock_quantity: 10
    }];
    productServiceStub.getAll.resolves(expectedProducts);

    const response = await request(app).get('/products');

    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body.products));
    assert.strictEqual(response.body.products.length, 1);
    assert.deepEqual(response.body.products[0], expectedProducts[0]);
  });

  it('should get a product by ID', async function() {
    const productId = '1';
    const expectedProduct = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock_quantity: 10
    };
    productServiceStub.get.resolves(expectedProduct);

    const response = await request(app).get(`/products/${productId}`);

    assert.strictEqual(response.status, 200);
    assert.deepEqual(response.body.product, expectedProduct);
  });

  it('should create a product', function(done) { // Notez l'utilisation de "done" ici
    const newProduct = {
        fields: {
            name: 'Product 1',
            description: 'Description 1',
            price: "100",
            stock_quantity: "10"
        }
    };

    const createdProduct = { id: '2', ...newProduct.fields };
    productServiceStub.create.resolves(createdProduct);

    request(app)
        .post('/products')
        .send(newProduct)
        .end((err, res) => {
            if (err) return done(err);
            assert.strictEqual(res.status, 200);
            assert.deepEqual(res.body.product, createdProduct);
            done(); // Indique que le test est terminé
        });
});

it('should update a product', function(done) { // Notez l'utilisation de "done" ici
    const productId = '1';
    const updatedFields = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: "150",
        stock_quantity: "20"
    };

    const updatedProduct = { id: productId, ...updatedFields };
    productServiceStub.update.resolves(updatedProduct);

    request(app)
        .put(`/products/${productId}`)
        .send({ fields: updatedFields })
        .end((err, res) => {
            if (err) return done(err);
            assert.strictEqual(res.status, 200);
            assert.deepEqual(res.body.product, updatedProduct);
            done(); // Indique que le test est terminé
        });
});



  it('should delete a product', async function() {
    const productId = '1';

    productServiceStub.remove.resolves({ message: 'Produit supprimé.' });

    const response = await request(app).delete(`/products/${productId}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'Produit supprimé.');
  });
});
