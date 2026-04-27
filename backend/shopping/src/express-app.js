// express.js (shopping service setup)
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { shopping } from './api/index.js';
// fixed: removed unused appEvents import
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
  shopping(app, channel);

  // fixed: catches malformed JSON from body-parser before global handler
  // this is why you were getting HTML error pages — this was missing entirely
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
    }
    next(err);
  });

  // global error handler
  app.use((err, req, res, next) => {
    console.error(err.message);
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });
};