require('./gulp/gulp-prep.js');
require('./gulp/gulp-webpack.js');
require('./gulp/gulp-webpack-min.js');
require('./gulp/gulp-dist.js');
require('./gulp/gulp-test.js');

let gulp = require('gulp');
let runSequence = require('run-sequence');

gulp.task('prep', ['gulp-prep'], function() {
});

gulp.task('webpack', ['gulp-webpack'], function() {
});

gulp.task('webpack-min', ['gulp-webpack-min'], function() {
});

gulp.task('pack', ['webpack', 'webpack-min'], function() {
});

gulp.task('dist', ['gulp-dist'], function() {
});

gulp.task('test', ['gulp-test'], function() {
});

gulp.task('default', function(cb) {
	runSequence(
		'prep',
		'pack',
		'dist',
		'test',
		function() {
			cb();
		}
	);
});
