const { defineConfig } = require('cypress');

const setupPlugins = require('./cypress/plugins/index.js');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000/',
    specPattern: 'cypress/e2e/**/*.js',
    viewportWidth: 1400,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      return setupPlugins(on, config);
    },
    // Don't fail tests on non-2xx status codes
    failOnStatusCode: false,
  },
  numTestsKeptInMemory: 5,
}); 