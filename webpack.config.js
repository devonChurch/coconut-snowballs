const path = require('path');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const consola = require('consola');
const PRODUCTION_ENV = 'production';
const DEVELOPMENT_ENV = 'development';
const { NODE_ENV = PRODUCTION_ENV } = process.env;
const isProduction = NODE_ENV === PRODUCTION_ENV;
const dirDist = path.resolve(__dirname);
const dirSrc = path.resolve(__dirname, 'src');
const libraryName = 'coconutSnowballs';
const logger = consola.withScope('translation');

logger.start({ nodeEnvironment: NODE_ENV });

module.exports = [
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

    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          include: dirSrc,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    plugins: isProduction
      ? [
          // new CleanWebpackPlugin(dirDist),
          new UglifyJSPlugin({ sourceMap: true }),
          new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(PRODUCTION_ENV) }),
          // new BundleAnalyzerPlugin(),
        ]
      : [],
  },

  ...(() => {
    const createNodeConfig = name => ({
      mode: isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV,

      target: 'node',

      entry: `${dirSrc}/${name}.js`,

      output: {
        path: dirDist,
        filename: `${name}.js`,
        libraryTarget: 'umd',
      },

      devtool: isProduction ? 'source-map' : 'cheap-source-map',

      stats: isProduction ? 'normal' : 'errors-only',

      module: {
        rules: [
          {
            test: /\.(js)$/,
            use: 'babel-loader',
            include: dirSrc,
          },
        ],
      },

      resolve: {
        extensions: ['.ts', '.js'],
      },
    });

    return [createNodeConfig('cli-sequence'), createNodeConfig('json-sequence')];
  })(),
];
