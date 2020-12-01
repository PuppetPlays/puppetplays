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

    // Set up the proxy.
    if (dev) {
      const { createProxyMiddleware } = require('http-proxy-middleware');
      server.use('/api', createProxyMiddleware({
        target: 'https://puppetplays.ddev.site:7443',
        changeOrigin: true,
        secure: false
      }));
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });
  