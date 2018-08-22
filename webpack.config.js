const path = require('path')
const webpack = require('webpack')

process.noDeprecation = true

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  externals: {
    "react": "react",
    "babel-core": "babel-core",
    "babel-preset-env": "babel-preset-env",
    "babel-preset-react": "babel-preset-react",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    })
  ],
  resolve: {
		extensions: [".js", ".jsx", ".json"],
  },
  target: 'web',
  node: {
    fs: 'empty',
    module: 'empty',
    net: 'empty',
  },
}