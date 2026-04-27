import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from './api/index.js';
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
  products(app, channel);

  // must be registered AFTER all routes, only ONCE
  // catches malformed JSON from body-parser before the global handler
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
    }
    next(err);
  });

  // global error handler — catches all errors passed via next(err)
  app.use((err, req, res, next) => {
    console.error(err.message);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });
};