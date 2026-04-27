import CustomerService from '../services/customer-service.js';
import UserAuth from './middlewares/auth.js';
import { SubscribeMessage } from '../utils/index.js';

export default function CustomerApi(app, channel) {

  const service = new CustomerService();
  SubscribeMessage(channel, service);

  app.post('/signup', async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      const { data } = await service.SignUp({ email, password, phone });
      return res.status(201).json(data);
    } catch (err) {
      next(err); 
    }
  });

  app.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/address', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const { data } = await service.AddNewAddress(_id, { street, postalCode, city, country });
      return res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/profile', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id }); // fixed: now matches GetProfile({ _id }) signature
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/shopping-details', UserAuth, async (req, res, next) => { // fixed: typo shoping → shopping
    try {
      const { _id } = req.user;
      const { data } = await service.GetShoppingDetails(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/wishlist', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/whoami', (req, res) => {
    return res.status(200).json({ msg: '/customer : I am Customer Service' });
  });
};