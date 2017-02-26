var path = require('path');

module.exports = {
  entry: {
    'artemis.core': './src/artemis.core.js'
  },
  output:{
    publicPath: '/',
    filename: 'dist/[name].js',
    libraryTarget: "var",
    library: 'artemis'
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
    contentBase: './test/pages'
  }
};
