// api/shopping-api.js
import ShoppingService from '../services/shopping-service.js';
import { SubscribeMessage, PublishMessage } from '../utils/index.js';
import { BadRequestError } from '../utils/app-errors.js';
import UserAuth from './middlewares/auth.js';
import { CUSTOMER_SERVICE } from '../config/index.js';

export default (app, channel) => {
  const service = new ShoppingService();
  SubscribeMessage(channel, service);

  app.post('/order', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { txnNumber } = req.body;
      if (!txnNumber) throw new BadRequestError('txnNumber is required');

      const { data } = await service.PlaceOrder({ _id, txnNumber });
      const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');
      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/orders', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put('/cart', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      if (!req.body._id) throw new BadRequestError('Product _id is required');
      // fixed: was silently passing undefined product id to service
      const { data } = await service.ManageCart(_id, req.body, req.body.qty, false);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/cart/:id', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.ManageCart(_id, { _id: req.params.id }, 1, true);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/cart', UserAuth, async (req, res, next) => {
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);
    console.log("auth header:", req.headers.authorization);
    try {
      const { _id } = req.user;
      const { data } = await service.GetCart({ _id });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/whoami', (req, res) => {
    return res.status(200).json({ msg: '/shopping : I am Shopping Service' });
  });
};