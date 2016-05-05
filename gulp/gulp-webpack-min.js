var webpackMinConfig = require('../webpack-min.config.js');
var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('gulp-webpack-min', function(callback) {
  webpack(
    webpackMinConfig
    , function(err, stats) {
      if (err) {
        console.log('ERROR - ',err);
      } else {
        console.log('Stats - ',stats);
      }
      callback();
    });
});
