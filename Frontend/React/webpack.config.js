const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const VENDOR_LIBS = ['react', 
                     'react-dom', 
                     'react-router-dom',
                     'mobx',
                     'mobx-react-lite'
];

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.tsx',
    // vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].[chunkhash].bundle.js',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    usedExports: true,
  }
};