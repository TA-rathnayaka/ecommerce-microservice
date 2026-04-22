import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { customer, appEvents } from './api/index.js';
import { CreateChannel, SubscribeMessage } from './utils/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //api
    // appEvents(app);

    const channel = await CreateChannel()

    
    customer(app, channel);
    // error handling
    
}
