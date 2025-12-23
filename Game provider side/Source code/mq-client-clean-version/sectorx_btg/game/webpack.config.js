const path = require('path');
const PROJECT_SRC = path.resolve(__dirname, 'src');
const PIXI_SRC = path.resolve(__dirname, "../../common/PIXI");
const SHARED_SRC = path.resolve(__dirname, "../shared/src");
const webpack = require('webpack');

module.exports = {
	entry: [
		'babel-polyfill',
		'./src/index',
		'webpack-dev-server/client?http://localhost:8081'
	],
	output: { filename: 'game.js' },
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [PIXI_SRC, PROJECT_SRC, SHARED_SRC],
				exclude: [],
				loader: 'babel-loader?cacheDirectory',
				query: { presets: ["es2015", "stage-0"], cacheDirectory: true}
			}
		],
		noParse: /.*[\/\\]bin[\/\\].+\.js/
	},
	optimization: {
		minimize: false
	},
	devServer: { contentBase: __dirname },
	plugins: [
		new webpack.ProvidePlugin({
			PIXI: path.resolve(path.join(__dirname, '../../common/PIXI/node_modules/pixi.js-legacy'))
		})
	]};
