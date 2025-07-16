// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' });

const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 7000;
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

let server;

app
  .prepare()
  .then(() => {
    server = express();
    server.use(cookieParser());

    // Route proxy HAL directe dans Express (bypass Next.js API)
    server.get('/api/hal-proxy', async (req, res) => {
      console.log('=== HAL PROXY EXPRESS ===');
      console.log('URL:', req.url);
      console.log('Query:', req.query);

      try {
        const { url: halUrl } = req.query;

        if (!halUrl) {
          return res.status(400).json({
            error: 'Paramètre url requis',
            usage: '/api/hal-proxy?url=https://hal.science/hal-XXXXX/document',
          });
        }

        if (!halUrl.includes('hal.science') || !halUrl.includes('hal-')) {
          return res.status(400).json({
            error: 'URL HAL invalide',
          });
        }

        console.log('HAL Proxy Express: requesting', halUrl);

        const halResponse = await fetch(halUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'PuppetPlays-Proxy/1.0',
          },
        });

        if (!halResponse.ok) {
          console.error('HAL error:', halResponse.status);
          return res.status(halResponse.status).json({
            error: 'Document HAL introuvable',
          });
        }

        const contentType =
          halResponse.headers.get('content-type') || 'application/pdf';

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const buffer = await halResponse.arrayBuffer();
        console.log('HAL Proxy Express: success', buffer.byteLength, 'bytes');

        return res.send(Buffer.from(buffer));
      } catch (error) {
        console.error('HAL Proxy Express error:', error);
        return res.status(500).json({
          error: 'Erreur proxy HAL Express',
          message: error.message,
        });
      }
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.get(/(.*)/, (req, res) => handle(req, res));

    server.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
