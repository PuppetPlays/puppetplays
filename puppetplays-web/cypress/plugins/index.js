const http = require('http');
const next = require('next');
const nock = require('nock');

// start the Next.js server when Cypress starts
module.exports = async (on, config) => {
  const app = next({ dev: true });
  const handleNextRequests = app.getRequestHandler();
  await app.prepare();

  const customServer = new http.Server(async (req, res) => {
    return handleNextRequests(req, res);
  });

  await new Promise((resolve, reject) => {
    customServer.listen(5000, (err) => {
      if (err) {
        return reject(err);
      }
      console.log('> Ready on http://localhost:5000');
      resolve();
    });
  });

  on('task', {
    activateNock() {
      nock.activate();

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
