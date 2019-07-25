const { resolve } = require('./utils');
const HappyPack = require('happypack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const cleanWebpackPlugin = require('clean-webpack-plugin');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

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
              test: cssModuleRegex,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[path][local]-[hash:base64:5]'
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        overrideBrowserslist: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9'
                        ],
                        flexbox: 'no-2009'
                      })
                    ],
                    sourceMap: false
                  }
                }
              ]
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: require.resolve('css-loader')
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        overrideBrowserslist: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9'
                        ],
                        flexbox: 'no-2009'
                      })
                    ],
                    sourceMap: false
                  }
                }
              ],
              sideEffects: false
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: require.resolve('css-loader')
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        overrideBrowserslist: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9'
                        ],
                        flexbox: 'no-2009'
                      })
                    ],
                    sourceMap: false
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: false
                  }
                }
              ],
              sideEffects: false
            },
            {
              test: sassModuleRegex,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[path][local]-[hash:base64:5]'
                  }
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        overrideBrowserslist: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9'
                        ],
                        flexbox: 'no-2009'
                      })
                    ],
                    sourceMap: false
                  }
                },
                {
                  loader: require.resolve('sass-loader'),
                  options: {
                    sourceMap: false
                  }
                }
              ]
            },
            {
              test: /\.less/,
              include: [resolve('src')],
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    localIdentName: '[path][local]-[hash:base64:5]'
                  }
                },
                'less-loader'
              ]
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
      new MiniCssExtractPlugin({
        filename: config.noHash ? 'css/[name].css' : 'css/[name].[chunkhash].css'
      }),
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
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  };
};
