let webpackMinConfig = require('../webpack-min.config.js');
let gulp = require('gulp');
let webpack = require('webpack');

gulp.task('gulp-webpack-min', function(cb) {
  webpack(
    webpackMinConfig,
    function(err, stats) {
      if (err) {
        console.log('ERROR - ',err);
      } else {
        console.log('Stats - ',stats);
      }
      cb();
    });
});
