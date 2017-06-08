module.exports = function(config) {
	config.set({
		frameworks: ['jasmine'],

		files: [
			'./node_modules/babel-polyfill/dist/polyfill.js',
			'./test/jasmine/*.js'
		],

		plugins: [
			require("karma-webpack"),
			'karma-jasmine',
			'karma-phantomjs-launcher'
		],

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

		browsers:['PhantomJS'],

		singleRun: true
	})
};



// module.exports = function(config) {
//   config.set({
//
//     // base path that will be used to resolve all patterns (eg. files, exclude)
//     basePath: '',
//
//     // frameworks to use
//     // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
//     frameworks: ['jasmine'],
//
//     // list of files / patterns to load in the browser
//     files: [
//       './test/jasmine/*.js'
//     ],
//
//     plugins: [
//       require("karma-webpack"),
//       'karma-jasmine'
//     ],
//
//     // list of files to exclude
//     exclude: [
//     ],
//
//     // preprocess matching files before serving them to the browser
//     // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
//     preprocessors: {
//       './test/**/*.js': ['webpack'],
//       './src/**/*.js': ['webpack']
//     },
//
//     webpack: {
//       module:{
//         loaders: [
//           {
//             test: /\.js$/,
//             include: /(src|test)/,
//             loader: 'babel-loader',
//             query: {
//               presets: ['es2015'],
//               sourceMap: 'inline'
//             }
//           }
//         ]
//       }
//     },
//
//     webpackMiddleware: {
//       noInfo: true
//     },
//     singleRun: true//run only once
//
//   })
// };
