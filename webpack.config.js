var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: { 
        "artemis.core": './src/artemis.core.js'
    },
    output:{
    
        publicPath: '/',
        filename: 'dist/[name].js',
        library: "core"
        // filename: 'dist/artemis.js'
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