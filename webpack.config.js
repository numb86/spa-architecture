const webpack = require('webpack');
const path = require('path');
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SOURCE_DIR_NAME = 'src';
const OUTPUT_DIR_NAME = 'public';

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
      chunks: ['vendors', 'index'],
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ];

  const splitChunks = {
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  };
  const minimizer = [
    new TerserPlugin({
      terserOptions: {
        output: {
          comments: /^\**!|@preserve|@license|@cc_on/,
        },
      },
    }),
  ];
  let optimization = {
    splitChunks,
  };

  if (isProduction) {
    plugins.push(
      new CleanWebpackPlugin(),
      new LicenseInfoWebpackPlugin({
        glob: '{LICENSE,license,License}*',
      })
    );
    optimization = {
      splitChunks,
      minimizer,
    };
  }

  return {
    devtool: isProduction ? '' : 'source-map',
    context: path.resolve(__dirname, SOURCE_DIR_NAME),
    entry: {
      index: './index.tsx',
    },
    output: {
      path: path.resolve(__dirname, OUTPUT_DIR_NAME),
      filename: isProduction ? '[name].[contentHash].js' : '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {test: /\.*(ts|tsx)$/, exclude: /node_modules/, loader: 'babel-loader'},
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins,
    optimization,
    devServer: {
      contentBase: path.resolve(__dirname, OUTPUT_DIR_NAME),
      host: '0.0.0.0',
      disableHostCheck: true,
      hot: true,
      historyApiFallback: true,
    },
  };
};
