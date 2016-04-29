# push2cloud example app

The app provided here can be used to illustrate the core concepts of push2cloud. The base app is taken from [TodoMVC](http://todomvc.com/)

## apps
The example consists of two applications, the customer-facing host and the backend api.

### host
The host application offers the UI to the browser. It requires communication to the `push2cloud-example-api` app. The `appConnection` in the `package.json` allows this by only knowing its name.

### api
The api application offers a REST API to the host app. It requires a redis service to persist its data. The `serviceBinding` entry in the `package.json` makes this easy.
