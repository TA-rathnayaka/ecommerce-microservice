import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ProductSchema = new mongoose.Schema({
    name: String,
    desc: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    suplier: String
});

const ProductModel = mongoose.model('product', ProductSchema);

const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sampledata.json'), 'utf8'));

// Use MONGODB_URI from env or default to nosql-db for execution inside docker
const DB_URL = process.env.MONGODB_URI || 'mongodb://nosql-db/msytt_product';
console.log('Connecting to:', DB_URL);

async function seed() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        await ProductModel.deleteMany({});
        console.log('Cleared existing products');

        await ProductModel.insertMany(seedData);
        console.log('Inserted seed products');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
