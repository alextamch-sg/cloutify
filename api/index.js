/**
 * @file api/index.js
 * Vercel Serverless Function entry point routing all /api routes
 */

import express from 'express';
import apiRouter from './routes.js';

const app = express();

app.use(express.json());

// Enable CORS for frontend and external health monitors
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key'
  );
  next();
});

// Support both /api prefixes and root routing for Vercel Serverless functions
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
