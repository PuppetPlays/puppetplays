// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' });

const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 7001;
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
