// services/shopping-service.js
import { ShoppingRepository } from '../database/index.js';
import { FormateData } from '../utils/index.js';
import { APIError, NotFoundError, BadRequestError } from '../utils/app-errors.js';

class ShoppingService {

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async GetCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
      if (!cartItems) throw new NotFoundError('Cart not found');
      return FormateData(cartItems);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new APIError('Could not fetch cart', 500, err.message);
    }
  }

  async PlaceOrder(userInput) {
    try {
      const { _id, txnNumber } = userInput;
      if (!txnNumber) throw new BadRequestError('txnNumber is required');
      // fixed: was silently passing undefined txnNumber to repository
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      if (err instanceof BadRequestError) throw err;
      throw new APIError('Could not place order', 500, err.message);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError('Could not fetch orders', 500, err.message);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      if (!customerId || !item?._id) throw new BadRequestError('customerId and item._id are required');
      const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
      return FormateData(cartResult);
    } catch (err) {
      if (err instanceof BadRequestError) throw err;
      throw new APIError('Could not manage cart', 500, err.message);
    }
  }

  async GetOrderPayload(userId, order, event) {
    if (!order) throw new NotFoundError('No order available');
    // fixed: was returning FormateData({ error }) with 200 OK — should throw
    return {
      event,
      data: { userId, order }
    };
    // fixed: removed unnecessary try/catch with throw — no async work here
  }

  async SubscribeEvents(payload) {
    try {
      const { event, data } = JSON.parse(payload);
      // fixed: was reassigning payload param — destructure directly
      const { userId, product, qty } = data;

      switch (event) {
        case 'ADD_TO_CART':
          await this.ManageCart(userId, product, qty, false);
          // fixed: missing await — errors were silently swallowed
          break;
        case 'REMOVE_FROM_CART':
          await this.ManageCart(userId, product, qty, true);
          // fixed: missing await
          break;
        default:
          console.warn('Unknown event:', event);
          break;
      }
    } catch (err) {
      console.error('SubscribeEvents error:', err.message);
    }
  }
}

export default ShoppingService;