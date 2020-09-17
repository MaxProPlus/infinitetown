const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    const prod = argv.mode === 'production'
    return {
        devtool: prod ? 'source-map' : 'inline-source-map',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, '../build'),
            filename: prod ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-class-properties']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            })
        ],
        devServer: {
            contentBase: './public',
            port: 3000,
        },
    }
}


