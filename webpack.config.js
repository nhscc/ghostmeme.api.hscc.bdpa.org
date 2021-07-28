// This webpack config is used to transpile src to dist, compile externals,
// compile executables, etc

const { EnvironmentPlugin, DefinePlugin, BannerPlugin } = require('webpack');
const ThreadsPlugin = require('threads-plugin');
const { verifyEnvironment } = require('./expect-env');
const nodeExternals = require('webpack-node-externals');
const debug = require('debug')(`${require('./package.json').name}:webpack-config`);

let env = {};

try {
  require('fs').accessSync('.env');
  env = require('dotenv').config().parsed;
  debug('new env vars: %O', env);
} catch (e) {
  debug(`env support disabled; reason: ${e}`);
}

verifyEnvironment();

const envPlugins = [
  // ? Load our .env results as the defaults (overridden by process.env)
  new EnvironmentPlugin({ ...env, ...process.env }),
  // ? Create shim process.env for undefined vars (per my tastes!)
  new DefinePlugin({ 'process.env': '{}' })
];

const externals = [
  nodeExternals(),
  ({ request }, cb) =>
    // ? Externalize all .json imports (required as commonjs modules)
    /\.json$/.test(request) ? cb(null, `commonjs ${request}`) : cb()
];

/* const libConfig = {
  name: 'lib',
  mode: 'production',
  target: 'node',
  node: false,

  entry: `${__dirname}/src/index.ts`,

  output: {
    filename: 'index.js',
    path: `${__dirname}/dist`,
    // ! ▼ Only required for libraries
    // ! ▼ Note: ESM outputs are handled by Babel ONLY!
    libraryTarget: 'commonjs2'
  },

  externals,
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: { extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'] },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  ignoreWarnings: [/critical dependency:/i, /Conflicting values for 'process.env.NODE_ENV'/],
  plugins: [...envPlugins]
}; */

const externalsConfig = {
  name: 'externals',
  mode: 'production',
  target: 'node',
  node: false,

  entry: {
    'ban-hammer': `${__dirname}/external-scripts/ban-hammer.ts`,
    'prune-data': `${__dirname}/external-scripts/prune-data.ts`,
    'initialize-data': `${__dirname}/external-scripts/initialize-data.ts`,
    'simulate-activity': `${__dirname}/external-scripts/simulate-activity.ts`
  },

  output: {
    filename: '[name].js',
    path: `${__dirname}/external-scripts/bin`
  },

  externals,
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
    // ! If changed, also update these aliases in tsconfig.json,
    // ! jest.config.js, next.config.ts, and .eslintrc.js
    alias: {
      universe: `${__dirname}/src/`,
      multiverse: `${__dirname}/lib/`,
      testverse: `${__dirname}/test/`,
      externals: `${__dirname}/external-scripts/`,
      types: `${__dirname}/types/`
    }
  },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  ignoreWarnings: [
    /critical dependency:/i,
    /Conflicting values for 'process.env.NODE_ENV'/
  ],
  plugins: [
    ...envPlugins,
    // * ▼ For non-bundled externals, make entry file executable w/ shebang
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true }),
    // * ▼ For threads.js support @ https://threads.js.org/getting-started
    new ThreadsPlugin()
  ]
};

/*const cliConfig = {
  name: 'cli',
  mode: 'production',
  target: 'node',
  node: false,

  entry: `${__dirname}/src/cli.ts`,

  output: {
    filename: 'cli.js',
    path: `${__dirname}/dist`
  },

  externals,
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: { extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'] },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  ignoreWarnings: [/critical dependency:/i, /Conflicting values for 'process.env.NODE_ENV'/],
  plugins: [
    ...envPlugins,
    // * ▼ For bundled CLI applications, make entry file executable w/ shebang
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true })
  ]
};*/

module.exports = [/*libConfig,*/ externalsConfig /*, cliConfig*/];
debug('exports: %O', module.exports);
