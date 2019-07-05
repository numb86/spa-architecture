const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: '11',
        safari: '7',
      },
      useBuiltIns: 'usage',
      corejs: '3',
    },
  ],
  [
    '@babel/preset-react',
    {
      development: process.env.NODE_ENV === 'development',
    },
  ],
  ['@babel/preset-typescript'],
];

const plugins = [];

if (process.env.NODE_ENV === 'test') {
  presets.push(['power-assert']);
}

if (process.env.NODE_ENV !== 'test') {
  plugins.push('react-remove-properties');
}

const config = {
  presets,
  plugins,
};

module.exports = config;
