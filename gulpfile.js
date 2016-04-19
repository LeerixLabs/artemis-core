var gulp = require('gulp');
var Server = require('karma').Server;
var webpack = require("webpack");
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('./webpack.config.js');


gulp.task('webpack-dev-server', function (c) {
    var myConfig = Object.create(webpackConfig);

    myConfig.devtool = 'eval';
    myConfig.debug = true;
    myConfig.output.path = __dirname +  '/';
    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {        
        contentBase: myConfig.devServer.contentBase,//__dirname +'/src',
        
        stats: {
            colors: true
        }
    }).listen(8080, 'localhost', function (err) {
        if (err) {
            console.log('ERROR - ',err);
        }
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('serve', ['webpack-dev-server']);

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
gulp.task("production", function(callback) {
    // run webpack
    webpack(
       require('./webpack-production.config.js') 
    , function(err, stats) {
        callback();
    });
});
gulp.task("default", ['webpack','production'], function() {
});