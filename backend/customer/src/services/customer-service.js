import { CustomerRepository } from '../database/index.js';
import { FormateData, GeneratePassword, GenerateSignature, ValidatePassword } from '../utils/index.js';
// fixed: removed GenerateSalt import — no longer needed

class CustomerService {

    constructor(){
        this.repository = new CustomerRepository();
    }

    async SignIn(userInputs){
        const { email, password } = userInputs;
        
        const existingCustomer = await this.repository.FindCustomer({ email });

        if(!existingCustomer) throw new Error('Invalid email or password');

        const validPassword = await ValidatePassword(password, existingCustomer.password);

        if(!validPassword) throw new Error('Invalid email or password');

        const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id });
        return FormateData({ id: existingCustomer._id, token });
    }

    async SignUp(userInputs){
        const { email, password, phone } = userInputs;
        
        const userPassword = await GeneratePassword(password);

        const newCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone });

        const token = await GenerateSignature({ email, _id: newCustomer._id });
        return FormateData({ id: newCustomer._id, token });
    }

    async AddNewAddress(_id, userInputs){
        const { street, postalCode, city, country } = userInputs;
        const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city, country });
        return FormateData(addressResult);
    }

    async GetProfile({ _id }){
        const existingCustomer = await this.repository.FindCustomerById({ id: _id });
        return FormateData(existingCustomer);
    }

    async GetShoppingDetails(id){
        const existingCustomer = await this.repository.FindCustomerById({ id });
        if(existingCustomer) return FormateData(existingCustomer);
        throw new Error('Shopping details not found');
    }

    async GetWishList(customerId){
        const wishListItems = await this.repository.Wishlist(customerId);
        return FormateData(wishListItems);
    }

    async AddToWishlist(customerId, product){
        const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
        return FormateData(wishlistResult);
    }

    async ManageCart(customerId, product, qty, isRemove){
        const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);
        return FormateData(cartResult);
    }

    async ManageOrder(customerId, order){
        const orderResult = await this.repository.AddOrderToProfile(customerId, order);
        return FormateData(orderResult);
    }

    async SubscribeEvents(payload){
        console.log('Triggering.... Customer Events');

        const { event, data } = JSON.parse(payload);

        const { userId, product, order, qty } = data;

        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                await this.AddToWishlist(userId, product);
                break;
            case 'ADD_TO_CART':
                await this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                await this.ManageCart(userId, product, qty, true);
                break;
            case 'CREATE_ORDER':
                await this.ManageOrder(userId, order);
                break;
            default:
                console.warn('Unknown event received:', event);
                break;
        }
    }
}

export default CustomerService;