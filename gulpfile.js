var gulp = require('gulp');
var Server = require('karma').Server;
var webpack = require("webpack");
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
gulp.task("webpack", function(callback) {
    // run webpack
    webpack(
       require('./webpack.config.js') 
    , function(err, stats) {
        

        callback();
    });
});