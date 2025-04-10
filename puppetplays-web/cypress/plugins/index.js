const http = require('http');
const next = require('next');
const nock = require('nock');
const path = require('path');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env.local if it exists
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  // Set the directory where Next.js should look for pages
  const dev = process.env.NODE_ENV !== 'production';
  const dir = path.join(__dirname, '../../'); // Go up from cypress/plugins to the root of the Next.js app
  
  const app = next({ dev, dir });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = new http.Server(async (req, res) => {
    return handleNextRequests(req, res);
  });

  await new Promise((resolve, reject) => {
    customServer.listen(5000, err => {
      if (err) {
        return reject(err);
      }
      console.log('> Ready on http://localhost:5000');
      resolve();
    });
  });

  // Add webpack preprocessor with correct module resolution and provide process.env
  const options = {
    webpackOptions: {
      resolve: {
        modules: [path.resolve(__dirname, '../../'), 'node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({
            ...process.env,
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://puppetplays.ddev.site:7080'
          })
        })
      ]
    },
  };
  on('file:preprocessor', webpackPreprocessor(options));

  on('task', {
    activateNock() {
      if (!nock.isActive()) {
        nock.activate();
      }

      return null;
    },
    clearNock() {
      nock.restore();
      nock.cleanAll();

      return null;
    },

    async nock({
      hostname,
      method,
      path,
      reqBody,
      times = 1,
      statusCode,
      body,
    }) {
      method = method.toLowerCase();
      nock(hostname)
        [method](path, reqBody)
        .times(times)
        .reply(statusCode, body);

      return null;
    },
  });

  return config;
};
