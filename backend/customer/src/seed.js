import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AddressSchema = new mongoose.Schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
});

const CustomerSchema = new mongoose.Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address:[
        { type: mongoose.Schema.Types.ObjectId, ref: 'address', require: true }
    ],
    cart: [
        {
          product: { 
                _id: { type: String, require: true},
                name: { type: String},
                banner: { type: String},
                price: { type: Number},
            },
          unit: { type: Number, require: true}
        }
    ],
    wishlist:[
        {
            _id: { type: String, require: true },
            name: { type: String },
            description: { type: String },
            banner: { type: String },
            avalable: { type: Boolean },
            price: { type: Number },
        }
    ],
    orders: [
        {
            _id: {type: String, required: true},
            amount: { type: String},
            date: {type: Date, default: Date.now()}
        }
    ]
});

const CustomerModel = mongoose.model('customer', CustomerSchema);
const AddressModel = mongoose.model('address', AddressSchema);

const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sampledata.json'), 'utf8'));

// Use MONGODB_URI from env or default to nosql-db for execution inside docker
const DB_URL = process.env.MONGODB_URI || 'mongodb://nosql-db/msytt_customer';

try {
    await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await CustomerModel.deleteMany({});
    await AddressModel.deleteMany({});
    console.log('Cleared existing customers and addresses');

    if (Array.isArray(seedData)) {
        await CustomerModel.insertMany(seedData);
        console.log('Inserted seed customers');
    } else {
        console.log('Seed data is not an array, skipping insertion');
    }

    await mongoose.connection.close();
    process.exit(0);
} catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
}
