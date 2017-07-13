let gulp = require('gulp');
let Server = require('karma').Server;

gulp.task('gulp-test', function (cb) {
	new Server(
			{
				configFile: __dirname + '/../karma.conf.js',
				singleRun: true
			},
			cb
	).start();
});
