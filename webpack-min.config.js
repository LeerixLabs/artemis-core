var webpack = require('webpack');
var path = require('path');
var PACKAGE = require('./package.json');
var banner = `/**\n* LeerixLabs, ${PACKAGE.name} v${PACKAGE.version}\n* ${PACKAGE.description}\n* Date: ${new Date()}\n**/`;

module.exports = {
  entry: {
    "artemis.core": './src/artemis.core.js'
  },
  output:{
    publicPath: '/',
    filename: 'dist/[name].min.js',
    library: "artemisCore"
  },
  debug:'true',
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
    contentBase: "./src"
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, drop_console: true }
    }),
    new webpack.BannerPlugin(banner, { raw: true, entryOnly: true })
  ]
};
