var gulp = require('gulp');
var karma = require('karma');

function onTestsDone() {
  process.exit();
}

gulp.task('gulp-test', function () {
  new karma.Server({
    configFile: __dirname + '/../karma.conf.js',
    singleRun: true
  }, onTestsDone).start();
});
