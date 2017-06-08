require('./gulp/gulp-webpack.js');
require('./gulp/gulp-webpack-min.js');
require('./gulp/gulp-test.js');

var gulp = require('gulp');

gulp.task('webpack', ['gulp-webpack'], function() {
});

gulp.task('webpack-min', ['gulp-webpack-min'], function() {
});

gulp.task('pack', ['webpack', 'webpack-min'], function() {
});

gulp.task('test', ['gulp-test'], function() {
});

gulp.task('default', ['pack', 'test'], function() {
});
