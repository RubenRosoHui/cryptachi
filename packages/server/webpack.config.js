const path = require('path');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

const config = {
	target: 'node',
	mode: 'production',
	entry: './src/index.js',
	externals: [
    nodeExternals(),
    nodeExternals({ modulesDir: path.resolve(__dirname, '../../node_modules') })
  ],
	output: {
		filename: 'server.js',
		path: path.resolve(__dirname, '../../dist')
	}
};

module.exports = (env, argv) => {
	const target = process.env.TARGET_ENV || 'production';

	console.log(`Building for: ${target}`);
	if (target === 'staging') {
		config.plugins = [ new Dotenv({ path: './.env.staging.local' }) ];
	} else {
		config.plugins = [ new Dotenv({ path: './.env.production.local' }) ];
	}

	return config;
};
