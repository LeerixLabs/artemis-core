var webpack = require('webpack');
var path = require('path');
var PACKAGE = require('./package.json');
var banner = `/* ${PACKAGE.description} v${PACKAGE.version} */`;

module.exports = {
  entry: {
    "artemis.core": './src/artemis.core.js'
  },
  output:{
    publicPath: '/',
    filename: 'dist/[name].min.js',
    library: "artemisCore"
  },
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
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true
			}
		}),
		new webpack.BannerPlugin({
			banner: banner,
			raw: true,
			entryOnly: true
		})
	]
};
