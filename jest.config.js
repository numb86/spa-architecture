module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test.config.js'],
  preset: 'ts-jest/presets/js-with-babel',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
};
