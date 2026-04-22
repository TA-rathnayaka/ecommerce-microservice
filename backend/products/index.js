import express from 'express';
import { PORT } from './src/config/index.js';

const app = express();

app.use(express.json());

app.use('/', (req,res,next) => {

    return res.status(200).json({"msg": "Hello from Products"})
})


app.listen(PORT, () => {
    console.log(`Products is Listening to Port ${PORT}`)
})