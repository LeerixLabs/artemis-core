let webpackConfig = require('../webpack.config.js');
let gulp = require('gulp');
let webpack = require('webpack');

gulp.task('gulp-webpack', function(cb) {
  webpack(
    webpackConfig,
    function(err, stats) {
      if (err) {
        console.log('ERROR - ',err);
      } else {
        console.log('Stats - ',stats);
      }
	  cb();
    });
});
