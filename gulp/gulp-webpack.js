var webpackConfig = require('../webpack/webpack.config.js');
var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('gulp-webpack', function(callback) {
  webpack(webpackConfig
    , function(err, stats) {
      if (err) {
        console.log('ERROR - ',err);
      } else {
        console.log('Stats - ',stats);
      }
      callback();
    });
});
