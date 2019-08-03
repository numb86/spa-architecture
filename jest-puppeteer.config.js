const {port} = require('./e2e/jest.config').globals;

module.exports = {
  server: {
    command: 'node e2e/server.js',
    port,
    debug: true,
  },
  launch: {
    // devtools: true, // デバッグする際はこの行を uncomment する
    args: ['--no-sandbox', '--disable-gpu'],
  },
};
