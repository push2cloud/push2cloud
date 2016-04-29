const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
const logger = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.dev.babel').default;

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const app = express();
const compiler = webpack(config);
const port = process.env.PORT || '8080';
const nodeEnv = process.env.NODE_ENV || 'development';

// Configure the logger
app.use(logger('dev', {
  skip(req) {
    return nodeEnv === 'test' || req.path === '/favicon.ico';
  },
}));

// === Configure Webpack middleware ===
if (nodeEnv === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));

  app.use(webpackHotMiddleware(compiler));
}

// Serve static files and index.html
if (nodeEnv === 'production') {
  app.use('/assets', express.static('assets'));
}

// configure proxy middleware context
const context = '/api';                     // requests with this path will be proxied

// configure proxy middleware options
const options = {
  target: process.env.PUSH2CLOUD_EXAMPLE_API_HOST || 'http://www.example.org', // target host
  changeOrigin: true,                // needed for virtual hosted sites
  // ws: true,                       // proxy websockets
  // pathRewrite: {
  //   '^/old/api' : '/new/api',     // rewrite path
  //   '^/remove/api' : '/api'       // remove path
  // },
  proxyTable: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'localhost:8080': 'http://localhost:8081',
  },
};

// create the proxy
const proxy = proxyMiddleware(context, options);
app.use(proxy);

// Serve index.html from all URL's, allowing use of React Router.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* eslint-disable no-console */
app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server listening on port ${port} in ${nodeEnv} mode.`);
});
/* eslint-enable no-console */
