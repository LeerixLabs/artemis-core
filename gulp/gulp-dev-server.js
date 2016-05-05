var webpackConfig = require('../webpack.config.js');
var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.task('gulp-dev-server', function() {
  var portNumber = 8082;
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;
  myConfig.output.path = __dirname +  '/';
  new WebpackDevServer(webpack(myConfig), {
    contentBase: myConfig.devServer.contentBase,
    stats: {
      colors: true
    }
  }).listen(portNumber, 'localhost', function (err) {
    if (err) {
      console.log('ERROR - ',err);
    }
  });
});
