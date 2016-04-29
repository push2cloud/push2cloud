const express = require('express');
const bodyParser = require('body-parser')
const logger = require('morgan');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();


const app = express();
const port = process.env.PORT || '8081';
const nodeEnv = process.env.NODE_ENV || 'development';


var dbSettings = {
  type: 'redis',
  // host: 'localhost',      // optional
  // port: 27017,            // optional
  // dbName: 'viewmodel',    // optional
  // timeout: 10000          // optional
  // authSource: 'authedicationDatabase',        // optional
  // username: 'technicalDbUser',                // optional
  // password: 'secret'                          // optional
};

var dbService = appEnv.getService('todo-db');
if (dbService && dbService.credentials) {
  dbSettings = {
    type: 'redis',
    prefix: dbService.credentials.name,
    host: dbService.credentials.host,
    port: dbService.credentials.port,
    password: dbService.credentials.password
  };
}

require('viewmodel').write(
  dbSettings,
  function(err, repository) {
    if(err) {
      console.log('ohhh :-(', err);
      return;
    }
    const todoController = require('./lib/todoController')(repository);

    // Configure the logger
    app.use(logger('dev', {
      skip(/* req */) {
        return nodeEnv === 'test';
      },
    }));

    app.use(bodyParser.json());

    app.get('/api/todos', (req, res) => {
      todoController.get((err, data) => {
        res.json(data);
      });
    });

    app.post('/api/todos', (req, res) => {
      todoController.add(req.body, (err, data) => {
        res.json(data);
      });
    });

    app.patch('/api/todos/:id', (req, res) => {
      todoController.update(req.params.id, req.body, (err, data) => {
        res.json(data);
      });
    });

    app.delete('/api/todos/:id', (req, res) => {
      todoController.delete(req.params.id, (err, data) => {
        res.json(data);
      });
    });

    /* eslint-disable no-console */
    app.listen(port, err => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(`API listening on port ${port} in ${nodeEnv} mode.`);
    });
    /* eslint-enable no-console */
  }
);
