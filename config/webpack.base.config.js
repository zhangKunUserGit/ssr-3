const { resolve } = require('./utils');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = config => {
  return {
    // 打包的入口文件
    entry: resolve('src/main.js'),
    // 打包的出口
    output: {
      path: resolve('build'),
      publicPath: config.publicPath,
      // 入口文件生产的js
      filename: config.noHash ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      // 非入口文件生产的js
      chunkFilename: config.noHash ? 'js/[name].js' : 'js/[name].[chunkhash].js'
    },
    // 配置各种loader
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          exclude: [resolve('node_modules')],
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
                emitWarning: true,
                emitError: false,
                quiet: true
              },
              loader: require.resolve('eslint-loader')
            }
          ]
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx)$/,
              exclude: [resolve('node_modules')],
              use: ['happypack/loader?id=babel']
            },
            {
              test: /\.html$/,
              loader: 'html-loader'
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 6144,
                name: `${config.imagePath}${
                  config.noHash ? '[name].[ext]' : '[name].[hash:8]'
                }.[ext]`
              }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: `file-loader?name=${config.publicPath}fonts/${
                config.noHash ? '[name].[ext]' : '[name].[hash:8]'
              }.[ext]`
            },
            { test: /\.ejs$/, loader: 'ejs-compiled-loader' }
          ]
        }
      ]
    },
    resolve: {
      // 设置路径别名
      alias: {
        '@': resolve('src')
      },
      // 文件后缀自动补全
      extensions: ['.js', '.jsx']
    },
    // 第三方依赖，可以写在这里，不打包
    externals: {},
    plugins: [
      new HappyPack({
        id: 'babel',
        loaders: ['babel-loader']
      })
    ],
    optimization: {
      minimize: true,
      // 压缩css，由于配置css的压缩会覆盖默认的js压缩，所以js压缩也需要手动配置下
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        })
      ]
    }
  };
};
