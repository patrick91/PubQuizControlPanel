import path from 'path';
import webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


export default function makeConf(options) {
    let plugins;
    let cssLoaders;

    let entry = {
        index: './js/app',
    };

    if (options.development) {
        entry = {
            index: [
                'webpack-dev-server/client?http://0.0.0.0:5000',
                'webpack/hot/only-dev-server',
                './js/app',
            ],
        };

        // eslint-disable-next-line
        cssLoaders = 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader';

        plugins = [
            new HtmlWebpackPlugin({
                template: 'index.html',
                inject: true,
            }),
        ];
    } else {
        cssLoaders = ExtractTextPlugin.extract(
            'style-loader',
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader' // eslint-disable-line
        );

        plugins = [
            new webpack.optimize.UglifyJsPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.html',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
                inject: true,
            }),
            new ExtractTextPlugin('css/main.css', {
                allChunks: true,
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
            }),
        ];
    }

    return {
        entry,
        output: {
            path: 'dist',
            filename: 'bundle.js',
            publicPath: '/',
        },
        module: {
            loaders: [
                { test: /\.css/, loader: cssLoaders },
                { test: /\.js$/, loader: 'babel', exclude: path.join(__dirname, '/node_modules/') },
                { test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'url-loader?limit=10000' },
            ],
        },
        resolve: {
            root: [path.resolve('styles')],
            extensions: ['', '.js', '.jsx', '.json', '.css'],
        },
        plugins,
        postcss: () => [
            require('postcss-reporter')({
                clearMessages: true,
            }),
        ],
    };
}
