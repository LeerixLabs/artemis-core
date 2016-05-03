var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'artemis.core': './src/artemis.core.js'
  },
  output:{
    publicPath: '/',
    filename: 'dist/[name].js',
    library: 'artemisCore'
  },
  debug:'true',
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devServer: {
    contentBase: './src'
  }
};
