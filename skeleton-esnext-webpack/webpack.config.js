"use strict";
require('regenerator-runtime/runtime');
const easyWebpack = require('@easy-webpack/core');
const generateConfig = easyWebpack.default;
const get = easyWebpack.get;
const path = require('path');
const ELECTRON = process.env.ELECTRON && process.env.ELECTRON.toLowerCase() || false;
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
let config;

// basic configuration:
const title = 'Aurelia Navigation Skeleton';
const baseUrl = '/';
const rootDir = path.resolve();
const srcDir = path.resolve('src');
const outDir = path.resolve('dist');

const coreBundles = {
  bootstrap: [
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'regenerator-runtime',
    'bluebird'
  ],
  // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
  aurelia: [
    'aurelia-bootstrapper-webpack',
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-event-aggregator',
    'aurelia-framework',
    'aurelia-history',
    'aurelia-history-browser',
    'aurelia-loader',
    'aurelia-loader-webpack',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-pal',
    'aurelia-pal-browser',
    'aurelia-path',
    'aurelia-polyfills',
    'aurelia-route-recognizer',
    'aurelia-router',
    'aurelia-task-queue',
    'aurelia-templating',
    'aurelia-templating-binding',
    'aurelia-templating-router',
    'aurelia-templating-resources'
  ]
}

const baseConfig = {
  entry: {
    'app': ['./src/main'],
    'aurelia-bootstrap': ['./index'].concat(coreBundles.bootstrap),
    'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
  },
  output: {
    path: outDir,
  }
}

// advanced configuration:

switch (ENV) {
  case 'production':
    config = generateConfig(
      baseConfig,

      require('@easy-webpack/config-env-production')
        (true),
        
      require('@easy-webpack/config-aurelia')
        (rootDir, srcDir, title, baseUrl),

      require('@easy-webpack/config-babel')(),
      require('@easy-webpack/config-html')(),

      require('@easy-webpack/config-css')
        (false, { filename: 'styles.css', allChunks: !!ELECTRON }),

      require('@easy-webpack/config-fonts-and-images')(),
      require('@easy-webpack/config-global-bluebird')(),
      require('@easy-webpack/config-global-jquery')(),
      require('@easy-webpack/config-global-regenerator')(),
      require('@easy-webpack/config-generate-index-html')
        (true),

      require('@easy-webpack/config-uglify')
        (false)
    );
    break;
  
  case 'test':
    config = generateConfig(
      baseConfig,

      require('@easy-webpack/config-env-development')
        ('inline-source-map'),

      require('@easy-webpack/config-aurelia')
        (rootDir, srcDir, title, baseUrl),

      require('@easy-webpack/config-babel')(),
      require('@easy-webpack/config-html')(),

      require('@easy-webpack/config-css')
        (false, { filename: 'styles.css', allChunks: !!ELECTRON }),

      require('@easy-webpack/config-fonts-and-images')(),
      require('@easy-webpack/config-global-bluebird')(),
      require('@easy-webpack/config-global-jquery')(),
      require('@easy-webpack/config-global-regenerator')(),
      require('@easy-webpack/config-generate-index-html')()
    );
    break;
  
  default:
  case 'development':
    process.env.NODE_ENV = 'development';
    config = generateConfig(
      baseConfig,

      require('@easy-webpack/config-env-development')(),

      require('@easy-webpack/config-aurelia')
        (rootDir, srcDir, title, baseUrl),

      require('@easy-webpack/config-babel')(),
      require('@easy-webpack/config-html')(),

      require('@easy-webpack/config-css')
        (false, { filename: 'styles.css', allChunks: !!ELECTRON }),

      require('@easy-webpack/config-fonts-and-images')(),
      require('@easy-webpack/config-global-bluebird')(),
      require('@easy-webpack/config-global-jquery')(),
      require('@easy-webpack/config-global-regenerator')(),
      require('@easy-webpack/config-generate-index-html')
        (false)
    );
    break;
}

if (ELECTRON) {
  config = generateConfig(
    config,
    { entry: ['./index', './src/main'] },
    require('@easy-webpack/config-electron')(),
    ELECTRON == 'main' ? 
      require('@easy-webpack/config-electron-main')() : require('@easy-webpack/config-electron-renderer')()
  );
}

if (ENV !== 'test' && !ELECTRON) {
  config = generateConfig(
    config,
    require('@easy-webpack/config-common-chunks-simple')
      ('app', 'aurelia-bootstrap')
  );
}

if (ENV === 'test') {
  config = generateConfig(
    config,
    require('@easy-webpack/config-test-coverage-istanbul')()
  );
}

module.exports = config;