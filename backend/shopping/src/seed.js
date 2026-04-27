import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CartSchema = new mongoose.Schema({
    customerId: { type: String },
    items: [
        {   
            product: {
                _id: { type: String, require: true},
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                suplier: { type: String },
            } ,
            unit: { type: Number, require: true} 
        }
    ]
});

const OrderSchema = new mongoose.Schema({
    orderId: { type: String },
    customerId: { type: String },
    amount: { type: Number },
    status: { type: String },
    items: [
        {   
            product: {
                _id: { type: String, require: true},
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                suplier: { type: String },
            } ,
            unit: { type: Number, require: true} 
        }
    ]
}, { timestamps: true });

const CartModel = mongoose.model('cart', CartSchema);
const OrderModel = mongoose.model('order', OrderSchema);

const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sampledata.json'), 'utf8'));

// Use MONGODB_URI from env or default to nosql-db for execution inside docker
const DB_URL = process.env.MONGODB_URI || 'mongodb://nosql-db/msytt_shopping';

async function seed() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        await CartModel.deleteMany({});
        await OrderModel.deleteMany({});
        console.log('Cleared existing carts and orders');

        // Shopping sample data might be in a different format, usually it's empty initially
        // or has some sample carts. We'll skip insertion if it's not clearly defined.
        console.log('Shopping database cleared. Skipping insertion as sample data format is generic.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
