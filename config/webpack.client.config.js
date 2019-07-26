const merge = require('webpack-merge');
const webpack = require('webpack');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const baseConfig = require('./webpack.base.config');
const { resolve } = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const safePostCssParser = require('postcss-safe-parser');
const appEnv = require('./env');
const env = appEnv('/');
const config = require('./config')[process.env.NODE_ENV];
const postcssNormalize = require('postcss-normalize');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('isomorphic-style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          postcssNormalize()
        ],
        sourceMap: false
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: false
      }
    });
  }
  return loaders;
};

const clientConfig = merge(baseConfig(config), {
  entry: resolve('src/client-entry.js'),
  devtool: config.devtool,
  mode: config.env,
  // 配置各种loader
  module: {
    rules: [
      {
        oneOf: [
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                      autoprefixer: {
                        flexbox: 'no-2009'
                      },
                      stage: 3
                    }),
                    postcssNormalize()
                  ],
                  sourceMap: false
                }
              }
            ]
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                      autoprefixer: {
                        flexbox: 'no-2009'
                      },
                      stage: 3
                    }),
                    postcssNormalize()
                  ],
                  sourceMap: false
                }
              },
              {
                loader: require.resolve('sass-loader')
              }
            ]
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: false,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            })
          }
          // {
          //   test: sassModuleRegex,
          //   use: getStyleLoaders(
          //     {
          //       importLoaders: 1,
          //       sourceMap: false,
          //       modules: true,
          //       getLocalIdent: getCSSModuleLocalIdent
          //     },
          //     'sass-loader'
          //   )
          // }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new MiniCssExtractPlugin({
      filename: config.noHash ? 'css/[name].css' : 'css/[name].[chunkhash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'server.template.ejs',
      template: resolve('src/server.template.ejs')
    })
  ]
});

clientConfig.optimization.minimizer.push(
  new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      parser: safePostCssParser,
      map: {
        inline: false,
        annotation: false
      }
    }
  })
);

if (process.env.NODE_ENV === 'production') {
  clientConfig.plugins.push(
    new ReactLoadablePlugin({
      filename: 'build/react-loadable.json'
    })
  );
  clientConfig.optimization.splitChunks = {
    chunks: 'initial',
    minSize: 0,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        name: 'vendor',
        minChunks: 1,
        priority: 10
      }
    }
  };

  clientConfig.optimization.runtimeChunk = {
    name: 'manifest'
  };
}

module.exports = clientConfig;
