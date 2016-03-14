
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry:[
        'babel-polyfill',
        './src/artemis'
    ],
    output:{
        publicPath: '/',
        filename: 'dist/main.js'
    },
    debug:'true',
    devtool: 'source-map',
    module: {
        //TODO: we should import the settings from webpack.cong using require,
        //however, the include path are different (we don't need test in webpack)
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        contentBase: "./src"
    }
}