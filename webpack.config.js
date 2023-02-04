const path = require("path");
const process = require("process");
const { ProgressPlugin } = require("webpack"); // to access built-in plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function getHeaderTag() {
  return `
  <base href="/" />
  <link rel="icon" href="#"/>
  <link rel="apple-touch-icon" href="#">
  `;
}

function getBodyTag() {
  return `
  <noscript>
  </noscript>
  `;
}

function getConfigForWeb(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new HtmlWebpackPlugin({
        title: "CV Artist",
        template: path.join(process.cwd(), "./public/index.ejs"),
        filename: "index.html",
        headerTag: getHeaderTag(),
        bodyTag: getBodyTag(),
        meta: {
          "Theme color": { name: "theme-color", content: "#3367D6" },
          Charset: { charset: "UTF-8" },
          Viewport: {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        },
      }),
    ],
  };
}

function generateWebpackConfig(env) {
  let config = {
    mode: env.production === true ? "production" : "development",
    target: "web",
    entry: {
      index: "./src/",
    },
    output: {
      path: path.resolve(process.cwd(), "dist/umd"),
      filename: "[name].js",
      clean: true,
      libraryTarget: "umd",
      globalObject: "this", // https://webpack.js.org/configuration/output/#outputglobalobject
      publicPath: "", // TODO: Bug https://stackoverflow.com/questions/64294706/webpack5-automatic-publicpath-is-not-supported-in-this-browser
    },

    // which file should be handle. (for typescript)
    resolve: {
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },

    devServer: {
      static: {
        directory: path.resolve(process.cwd(), "dist/umd"),
      },
      open: true,
      hot: true,
      liveReload: true,
      compress: true,
      historyApiFallback: true,
    },

    module: {
      rules: [
        // loader for css
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader, // extracts CSS into separate files
            },
            {
              loader: require.resolve("css-loader"), // interprets @import and @url() and resolves them.
              options: {
                modules: {
                  localIdentName: "[local]",
                },
              },
            },
          ],
        },
        // ts loader
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("ts-loader"),
              options: {
                configFile: path.join(process.cwd(), "./tsconfig.json"),
                projectReferences: true, // https://github.com/TypeStrong/ts-loader#projectreferences
              },
            },
          ],
        },
        // image loader. It's need changes in output object
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      // Gives the build progress
      new ProgressPlugin(),
      // This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps (if source maps are enabled).
      new MiniCssExtractPlugin({
        filename: env.production !== true ? "[name].css" : "[contenthash].css",
        chunkFilename:
          env.production !== true ? "[id].css" : "[id].[contenthash].css",
      }),
    ],
  };
  if (env.web === true) {
    config = getConfigForWeb(config);
  }
  return config;
}

module.exports = generateWebpackConfig;
