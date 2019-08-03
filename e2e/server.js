const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const history = require('connect-history-api-fallback');
/* eslint-enable import/no-extraneous-dependencies */

const {host, port} = require('./jest.config').globals;

const app = express();
app.use(history());
const env = process.env.NODE_ENV || 'development';
app.use(express.static(path.join(__dirname, '../public')));
app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`[${env}] express server listening on ${host}:${port}`);
});
