const webpack = require('webpack');
const path = require('path');
const production = process.env.NODE_ENV === 'production' ? true : false;
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkplugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanPlugin = require('clean-webpack-plugin');

const webpackPlugin = [
        //定义全局为开发环境
        new webpack.DefinePlugin({
            'process.env':{
                "NODE_ENV":JSON.stringify('dev')
            }
        }),
        //在编译最终的静态资源前，清理output文件夹
       // new CleanPlugin('./output/'),

        new htmlWebpackPlugin({
            title: production ? 'react-app' : 'dev-react-app',
            date: new Date(),
            template: './template/index.html',
            inject: true,
            filename: 'index.html',
            minify:{
                removeComments: production ? true : false, //生产环境中移除html中的注释
                collapseWhitespace: production ? true : false, //生产环境中删除空白符与换行符
            },
        }),
        //开启全局的模块热替换
        new webpack.HotModuleReplacementPlugin(),
        //当模块热替换时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin(),
        new webpack.BannerPlugin({
            banner:'Autor: tiakia',
            raw:false,
        }),
        //用于提取公共模块common是公共的模块，vender是第三方库，load是webpack打包的再各个浏览器上加载的代码，必须先加载
         new CommonsChunkPlugin({
           name:['common','vendor','load'],
           filename: "[name].js",
           minChunks: 2,
         }),
        //css提取
        new ExtractTextPlugin({
          filename:'style.css',
          allChunks: true,
        }),
];

if(production){
     webpackPlugin.push([
         //对最终的js进行 Uglify 压缩
         new UglifyJsPlugin({
            compress: true,
            test: /\.jsx?$/i,
              parallel:{ //使用多进程并行和文件换成提高构建速度
                cache: true,
                workers:2,
            },
            warnings: false,
         }),
        ])
}
module.exports = {
    devtool: production ? "eval" : "cheap-module-eval-source-map",
    entry:{
        main:[

        'webpack-dev-server/client?http://localhost:9000',
        'webpack/hot/only-dev-server',
        './src/index.js',
        ],
        //第三方库
      vendor:['react','react-dom','redux','react-redux'],
    },
    output:{
        path:__dirname + '/output/',
        filename: '[name].bundle.js',
        publicPath: '',
    },
    module:{
        loaders:[
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader:'babel-loader',
                query:{
                  presets:['react','es2015']
                }
            },
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader'],
                    publicPath: './output/'
                })
            },
            {
              // scss 加载
              test: /\.scss$/i,
              use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use:["css-loader","postcss-loader","sass-loader"],
                  publicPath: './output/'
              })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                //loader: 'url-loader',
                // options: {
                //     limit: 10000, // 10k
                //     name: image/[name]-[hash:5].[ext]
                // },
                // loaders:[
                //     'url-loader?limit=10000&name=image/[name]-[hash:5].[ext]',
                //     'image-webpack-loader'
                // ],
                use:[
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'image/[name]-[hash:5].[ext]',
                        },
                    },
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(woff|ttf|eot)$/,
                loader: 'url-loader',
                query:{
                    limit: 20480,//20k
                },
            },
        ]
    },
  plugins: webpackPlugin,
   devServer:{
//      contentBase: [path.join(__dirname)],
        historyApiFallback: true,
//      compress: true,
        hot: true,
        port: 9000,
        inline: true,
        publicPath: '/', //和output 的‘publicPath'一致
//      progress: true,
    },

}
