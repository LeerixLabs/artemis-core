module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
        './test/jasmine/*.js'
    ],

    plugins: [
      require("karma-webpack"),
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/**/*.js': ['webpack'],
      './src/**/*.js': ['webpack']
    },

    webpack: {
      module:{
        loaders: [
          {
            test: /\.js$/,
            include: /(src|test)/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              sourceMap: 'inline'
            }
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true,//run only once

    browsers:[/*'Chrome'*/ 'PhantomJS'],

    customLaunchers:{
      Chrome_with_jetbrain:{
        base:'Chrome',
        flags: ['--load-extension=C:\\Users\\agamie\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\hmhgeddbohgjknpmjagkdomcpobmllji\\2.0.9_0']
      }
    }
  })
};
