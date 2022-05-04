const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = () => ({
  entry: {
    'app': './src/index.js',
    'nftstorage-sw': './node_modules/nftstorage-service-worker/src/nftstorage-sw.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
})
