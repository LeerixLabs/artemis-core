

var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: { 
        "artemis.core": './src/artemis.core.js'
    },
    output:{
    
        publicPath: '/',
        filename: 'dist/[name].js',
        library: "core"
    },
    debug:'true',
    module: {
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
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false, drop_console: true }
        })
    ]
}