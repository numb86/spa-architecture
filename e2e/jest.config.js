const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8090;
module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/**/*.test.ts'],
  globals: {
    host,
    port,
  },
};
