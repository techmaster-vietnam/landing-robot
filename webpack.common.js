const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerWebpackPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
const { ProvidePlugin } = require("webpack");
const json5 = require("json5");

module.exports = {
  // https://webpack.js.org/concepts/entry-points/
  entry: {
    index: { //entry point index
      import: "./src/js/index.js", //entry này dùng file index.js trong src, import css vào đây
      filename: "js/index.[contenthash].js", //và render ra file index.13212432214a.js (cache bursting)
    },
  },

  // https://webpack.js.org/concepts/output/
  output: {
    path: `${__dirname}/dist`, //chọn folder xuấy ra kq là /dist
    clean: true,
  },

 
  plugins: [
    
    new HtmlWebpackPlugin({ //đây là để render ra HTML
      template: "./src/index.html", //nó sẽ lấy mẫu là file HTML gốc trong src
      inject: "body", //nhét các thẻ script vào cuối thẻ body
      chunks: ["index"], //sử dụng entry point: index (xem bên trên entry)
      filename: "index.html", //cụ thể: cái này render ra index.html
    }),

    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({ //render ra css
      filename: "css/[name].[contenthash].css", //render thành phẩm là name.131323231.css (cache bursting), name ở đây là tên file css gốc
    }),

    // https://webpack.js.org/plugins/image-minimizer-webpack-plugin/
    new ImageMinimizerWebpackPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),

    // https://webpack.js.org/plugins/provide-plugin/
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],

  // https://webpack.js.org/concepts/modules/
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[hash][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        generator: {
          filename: "fonts/[name][ext]",
        },
        use: {
          loader: "url-loader", // Use url-loader when change generator filename
        },
      },
      {
        test: /\.json5$/i,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
};

//mấy đoạn dưới này tạm để nguyên vẫn ok, em có thể xem thêm bài a Huy để rõ
//tên file css đang k khớp, style.css và index.css
//vừa rồi có lỗi khi xử lý file css, anh cũng chưa chắc lỗi do đâu. Anh chuyển sang cách dùng file css bằng import như bên techmaster anonymous thì k lỗi. Nếu em chưa rõ cách này thì nó là tn:
//em sẽ không dùng thẻ <link> để nhúng css và <scrip> để nhúng js nữa, mà sẽ import file css này vào trong file entry JS (ở đây chính là index.js) và webpack nó sẽ nhúng cả css và js vào file html sau:
//<link href="css/index.e309aa433bb0ddcdf38c.css" rel="stylesheet">
//<script src="js/index.dg2wt2tsedfgsdgw4.js">, 
//đi kèm hash để cache bursting