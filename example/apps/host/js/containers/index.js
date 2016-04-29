export App from './App';

let Root;

if (__DEVELOPMENT__) {
  Root = require('./Root.dev').default;
} else {
  Root = require('./Root.prod').default;
}

export { Root };
