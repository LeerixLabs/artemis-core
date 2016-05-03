var gulp = require('gulp');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webpackMinConfig = require('./webpack-min.config.js');
var karmaServer = require('karma').Server;
var webpack = require('webpack');

gulp.task('serve', function() {
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

gulp.task('webpack', function(callback) {
  webpack(webpackConfig
    , function(err, stats) {
      callback();
    });
});

gulp.task('webpack-min', function(callback) {
  webpack(
    webpackMinConfig
    , function(err, stats) {
      callback();
    });
});

gulp.task('test', function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('pack', ['webpack', 'webpack-min'], function() {
});

gulp.task('default', ['pack', 'test'], function() {
});
