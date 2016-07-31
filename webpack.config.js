const webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: './source/js/app.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js',
    publicPath: '/dist/'
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-2', 'react'],
          cacheDirectory: '.webpackcache'
        }
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json'
      },
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^en$/)
  ]
};
