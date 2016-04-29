# application manifest

In the application manifest a developer defines the application, its dependencies on other applications, services and environment variables that should be set. The application manifest is a JSON file. While the two required values are located in the root object, all deployment information is located under the ```deployment``` key. This way, applications written in NodeJS can reuse their existing package.json file as their application manifest by simply adding the ```deployment``` section.

# example

```json

{
  "name": "push2cloud-example-api",
  "version": "1.0.0",
  "deployment": {
    "memory": 512,
    "disk": 512,
    "instances": 1,
    "startTimeout": 100,
    "stageTimeout": 200,
    "gracePeriod": 20,
    "buildpack": "https://github.com/cloudfoundry/nodejs-buildpack.git",
    "env": {
      "FOO": "BAR"
    },
    "appConnections": {
      "push2cloud-example-host": {
        "injectCredentials": false,
        "urls": {
          "START_URL": "/start"
        }
      }
    },
    "serviceBinding": [
      "todo-db"
    ]
  }
}

```

# schema

The schema defines the following properties:

## `name` (string, required)

Identifier for the application. Must be unique in a release. This value is used to identify an application throughout push2cloud, such as in `appConnections`, the [release manifest](release_manifest.md) and the [deployment manifest](deployment_manifest.md).

## `version` (string, required)

The version of your application. Use [semver](http://semver.org/). The version is used in certain [workflows](workflows.md) to determine if an update is required.

## `deployment` (object, required)

the entrypoint for all deployment information

Properties of the `deployment` object:

### `memory` (string)

the amount of memory the app requires, e.g.: 128M, 1G

Default: `"256M"`

Additional restrictions:

* Regex pattern: `^[0-9]*[MG]$`

### `disk` (string)

the amount of disk the app requires, e.g.: 128M, 1G

Default: `"256M"`

Additional restrictions:

* Regex pattern: `^[0-9]*[MG]$`

### `instances` (integer)

the base amount of instances

Default: `1`

Additional restrictions:

* Minimum: `1`

### `startTimeout` (integer)

how long the app can take to start before it is considered an error

### `stageTimeout` (integer)

how long the app can take to stage before it is considered an error

Default: `300`

### `gracePeriod` (integer)

how long the app has to run without crashing to be considered successfully started

Default: `40`

### `buildpack` (string)

buildbpack to build the application

### `env` (object)

environment variables to set/substitue for this app

Further properties are of type `string`

### `serviceBinding` (array)

names of services this app needs connections to

The object is an array with all elements of the type `string`.

### `appConnections` (object)

names of other apps this app needs connections to

Properties of the `appConnections` object:

#### `urls` (object)

inject the connection information additonally with the following key and with value as a suffix to the URL

Further properties are of type `string`

#### `injectCredentials` (boolean)

controls the injection of _USERNAME and _PASSWORD credentials for this connection
