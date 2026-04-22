import ShoppingService from '../services/shopping-service.js';
import { SubscribeMessage, PublishMessage } from '../utils/index.js';
import UserAuth from './middlewares/auth.js';
import { CUSTOMER_SERVICE } from '../config/index.js';

export default (app, channel) => {
    
    const service = new ShoppingService();

    SubscribeMessage(channel, service);

    // Create Order
    app.post('/order', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { txnNumber } = req.body;

            const { data } = await service.PlaceOrder({ _id, txnNumber });
            
            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');
            PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));

            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    // Get All Orders
    app.get('/orders', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetOrders(_id);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    // Add to Cart
    app.put('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            // Pass full req.body as item (needs _id, price, name etc.) and qty
            const { data } = await service.ManageCart(_id, req.body, req.body.qty, false);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    // Remove from Cart
    app.delete('/cart/:id', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            // Pass product id from URL param, isRemove = true
            const { data } = await service.ManageCart(_id, { _id: req.params.id }, 1, true);
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    // Get Cart
    app.get('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetCart({ _id });
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    // WhoAmI
    app.get('/whoami', (req, res, next) => {
        return res.status(200).json({ msg: '/shopping : I am Shopping Service' });
    });
};