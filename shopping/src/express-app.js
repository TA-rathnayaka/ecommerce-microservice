import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { shopping, appEvents } from './api/index.js';
import { CreateChannel } from './utils/index.js'

export default async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
 
    //api
    // appEvents(app);

    const channel = await CreateChannel()

    shopping(app, channel);
    // error handling
    
}
