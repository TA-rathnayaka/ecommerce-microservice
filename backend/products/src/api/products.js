// product-api.js
import { CUSTOMER_SERVICE, SHOPPING_SERVICE } from '../config/index.js';
import ProductService from '../services/product-service.js';
import { PublishMessage } from '../utils/index.js';
import { BadRequestError } from '../utils/app-errors.js';
import UserAuth from './middlewares/auth.js';

export default function ProductsApi(app, channel) {
  const service = new ProductService();

  app.get('/whoami', (req, res) => {
    return res.status(200).json({ msg: '/ or /products : I am Products Service' });
  });

  app.post('/product/create', async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } = req.body;

      if (!name || !desc || !type || !unit || !price) {
        throw new BadRequestError('name, desc, type, unit and price are required');
        // fixed: was returning plain 400 — now uses BadRequestError so error
        // handler logs it and returns consistent JSON shape
      }

      const { data } = await service.CreateProduct({ name, desc, type, unit, price, available, suplier, banner });
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/category/:type', async (req, res, next) => {
    try {
      const { data } = await service.GetProductsByCategory(req.params.type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/ids', async (req, res, next) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new BadRequestError('ids must be a non-empty array');
        // fixed: was returning res.status(400).json() directly — bypasses error handler
      }
      const { data } = await service.GetSelectedProducts(ids);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put('/wishlist', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      if (!req.body._id) throw new BadRequestError('Product _id is required');

      const { data } = await service.GetProductPayload(_id, { productId: req.body._id }, 'ADD_TO_WISHLIST');
      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      return res.status(200).json(data.product);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/wishlist/:id', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProductPayload(_id, { productId: req.params.id }, 'REMOVE_FROM_WISHLIST');
      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      return res.status(200).json(data.product);
    } catch (err) {
      next(err);
    }
  });

  app.put('/cart', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      if (!req.body._id || !req.body.qty) throw new BadRequestError('Product _id and qty are required');

      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        'ADD_TO_CART'
      );
      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));
      return res.status(200).json({ product: data.product, unit: data.qty });
    } catch (err) {
      next(err);
    }
  });

  app.delete('/cart/:id', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.params.id },
        'REMOVE_FROM_CART'
      );
      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
      PublishMessage(channel, SHOPPING_SERVICE, JSON.stringify(data));
      return res.status(200).json({ product: data.product, unit: data.qty });
    } catch (err) {
      next(err);
    }
  });

  app.get('/', async (req, res, next) => {
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/:id', async (req, res, next) => {
    try {
      const { data } = await service.GetProductDescription(req.params.id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};