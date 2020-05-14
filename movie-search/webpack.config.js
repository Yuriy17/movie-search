const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'dev';
const isProd = ENV === 'build';

function setDevTool() {
  if (isDev) {
    return 'cheap-module-eval-source-map';
  } else {
    return 'none';
  }
}

function setDMode() {
  if (isProd) {
    return 'production';
  } else {
    return 'development';
  }
}

const config = {
  target: 'web',
  entry: {
    index: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
  },
  mode: setDMode(),
  devtool: setDevTool(),
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: [/node_modules/],
      },

      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: { path: './postcss.config.js' },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,

              url: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: { path: './postcss.config.js' },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/img',
              name: '[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
                optimizationLevel: 1,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/',
              name: '[name].[ext]',
            },
          },
          
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: 'file-loader?name=[name].[ext]',
            options: {
/*               outputPath:
              isProd
              ? '/assets/fonts'
              : '/src/assets/fonts', */
              name: '[name].[ext]',
              publicPath: '../fonts/',
              outputPath: 'assets/fonts/'
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: './assets/stylesheets/[name].css',
      chunkFilename: '[name].css',
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
/*       {from: './src/assets/img', to: './assets/img/'},
      {from: './src/assets/sounds', to: './assets/sounds/'}, */
      {from: './src/favicon.ico', to: './'},
    ]),
    new Dotenv(),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    overlay: false,
    stats: 'errors-only',
    clientLogLevel: 'none',
  },
};

if (isProd) {
  config.plugins.push(new UglifyJSPlugin());
}

module.exports = config;
