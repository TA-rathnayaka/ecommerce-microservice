import { ShoppingRepository } from '../database/index.js';
import { FormateData } from '../utils/index.js';

class ShoppingService {

    constructor(){
        this.repository = new ShoppingRepository();
    }

    async GetCart({ _id }){
        try {
            const cartItems = await this.repository.Cart(_id);
            return FormateData(cartItems);
        } catch (err) {
            throw err;
        }
    }

    async PlaceOrder(userInput){
        try {
            const { _id, txnNumber } = userInput;
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
            return FormateData(orderResult);
        } catch (err) {
            throw err;
        }
    }

    async GetOrders(customerId){
        try {
            const orders = await this.repository.Orders(customerId);
            return FormateData(orders);
        } catch (err) {
            throw err;
        }
    }

    async GetOrderDetails({ _id, orderId }){
        try {
            // Fixed: was using undefined 'productId' variable
            const orders = await this.repository.Orders(orderId);
            return FormateData(orders);
        } catch (err) {
            throw err;
        }
    }

    // Fixed: route was calling AddToCart — correct name is ManageCart
    async ManageCart(customerId, item, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
            return FormateData(cartResult);
        } catch (err) {
            throw err;
        }
    }

    async SubscribeEvents(payload){
        try {
            payload = JSON.parse(payload);
            const { event, data } = payload;
            const { userId, product, qty } = data;
            
            switch(event){
                case 'ADD_TO_CART':
                    this.ManageCart(userId, product, qty, false);
                    break;
                case 'REMOVE_FROM_CART':
                    this.ManageCart(userId, product, qty, true);
                    break;
                default:
                    break;
            }
        } catch (err) {
            console.log('SubscribeEvents error:', err);
        }
    }

    async GetOrderPayload(userId, order, event){
        try {
            if(order){
                const payload = {
                    event: event,
                    data: { userId, order }
                };
                return payload;
            } else {
                return FormateData({ error: 'No Order Available' });
            }
        } catch (err) {
            throw err;
        }
    }
}

export default ShoppingService;