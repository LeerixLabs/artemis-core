var gulp = require('gulp');
var karma = require('karma');

gulp.task('gulp-test', function (done) {
  new karma.Server({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, done).start();
});
