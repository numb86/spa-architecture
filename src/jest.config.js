module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test.config.js'],
  preset: 'ts-jest/presets/js-with-babel',
  testMatch: ['<rootDir>/**/__tests__/**.test.(ts|tsx)'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
