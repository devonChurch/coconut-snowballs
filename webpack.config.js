const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PRODUCTION_ENV = 'production';
const DEVELOPMENT_ENV = 'development';
const { NODE_ENV = PRODUCTION_ENV } = process.env;
const isProduction = NODE_ENV === PRODUCTION_ENV;
const dirDist = path.resolve(__dirname);
const dirSrc = path.resolve(__dirname, 'src');
const libraryName = 'coconutSnowballs';

const config = [
  {
    mode: isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV,

    target: 'web',

    entry: dirSrc,

    output: {
      path: dirDist,
      filename: 'index.js',
      library: libraryName,
      libraryTarget: 'umd',
      globalObject: "typeof self !== 'undefined' ? self : this",
    },

    devtool: isProduction ? 'source-map' : 'cheap-source-map',

    stats: isProduction ? 'normal' : 'errors-only',

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          include: dirSrc,
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    // plugins: [new CleanWebpackPlugin(dirDist)]
  },

  // {
  //   mode: isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV,

  //   target: 'node',

  //   libraryTarget: 'commonjs',

  //   entry: `${dirSrc}/cli-sequence.js`,

  //   output: {
  //     path: dirDist,
  //     filename: 'cli-sequence.js',
  //   },

  //   devtool: isProduction ? 'source-map' : 'cheap-source-map',

  //   stats: isProduction ? 'normal' : 'errors-only',

  //   module: {
  //     rules: [
  //       // {
  //       //   test: /\.(ts|tsx)$/,
  //       //   use: 'shebang-loader ts-loader',
  //       //   include: dirSrc,
  //       // },
  //       // {
  //       //   test: /\.(js)$/,
  //       //   use: 'shebang-loader',
  //       //   include: dirSrc,
  //       // },
  //     ],
  //   },

  //   resolve: {
  //     extensions: ['.ts', '.js'],
  //   },
  // },
];

module.exports = config;
