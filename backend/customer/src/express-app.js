import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { customer, appEvents } from './api/index.js';
import { CreateChannel } from './utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'));

    app.get('/health', (req, res) => {
        return res.status(200).send('OK');
    });

    const channel = await CreateChannel();

    customer(app, channel);

    app.use((err, req, res, next) => {
        console.error(err.message);

        const statusCode = err.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
        });
    });
};