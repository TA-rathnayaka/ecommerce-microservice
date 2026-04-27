import { OrderModel, CartModel } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

//Dealing with data base operations
class ShoppingRepository {

    async Orders(customerId){

        const orders = await OrderModel.find({customerId });
        
        return orders;

    }

    async Cart(customerId){

        const cartItems = await CartModel.find({ customerId: customerId });


        if(cartItems){
            return cartItems;
        }

        throw new Error('Data Not found!');
    }

    async AddCartItem(customerId,item,qty,isRemove){
 
 
            const cart = await CartModel.findOne({ customerId: customerId })

            const { _id } = item;

            if(cart){
                
                let isExist = false;

                let cartItems = cart.items;


                if(cartItems.length > 0){

                    cartItems.map(item => {
                                                
                        if(item.product._id.toString() === _id.toString()){
                            if(isRemove){
                                cartItems.splice(cartItems.indexOf(item), 1);
                             }else{
                               item.unit = qty;
                            }
                             isExist = true;
                        }
                    });
                } 
                
                if(!isExist && !isRemove){
                    cartItems.push({product: { ...item}, unit: qty });
                }

                cart.items = cartItems;

                return await cart.save()
 
            }else{

               return await CartModel.create({
                    customerId,
                    items:[{product: { ...item}, unit: qty }]
                })
            }

        
    }
 
    async CreateNewOrder(customerId, txnId) {

        const cart = await CartModel.findOne({ customerId });

        if (!cart) {
            throw new Error('Cart not found for customer');
        }

        if (cart.items.length === 0) {
            throw new Error('Cart is empty — add items before placing an order');
        }

        let amount = 0;
        cart.items.forEach(item => {
            amount += Number(item.product.price) * Number.parseInt(item.unit, 10);
        });

        const orderId = uuidv4();

        const order = new OrderModel({
            orderId,
            customerId,
            amount,
            status: 'received',
            items: cart.items
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
    }

}

export default ShoppingRepository;
