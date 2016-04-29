# deployment manifest

In the deployment manifest, the deployment target specific information is defined, such as domain and service mappings.

# example

```json

{
  "name": "push2cloud-example",
  "version": "1.0.0",
  "description": "deployment manifest for push2cloud example",
  "target": {
    "type": "cloudfoundry",
    "api": "https://api.lyra-836.appcloud.swisscom.com",
    "space": "${SPACE}",
    "org": "${ORG}",
    "delay": 500,
    "maxRetries": 60
  },
  "release": {
    "name": "push2cloud-example",
    "source": {
      "type": "git",
      "url": "https://github.com/push2cloud/push2cloud.git",
      "referenceValue": "master"
    },
    "manifest": "example/manifests/release.json"
  },
  "secureAppConnections": true,
  "domains": {
    "public": "scapp.io",
    "internal": "scapp.io"
  },
  "serviceMapping": {
    "*-db": {
      "type": "redis",
      "plan": "small"
    }
  },
  "applicationDefaults": {
    "memory": "512M",
    "disk": "512M",
    "instances": 1,
    "startTimeout": 100,
    "stageTimeout": 200,
    "gracePeriod": 20,
    "buildpack": "https://github.com/cloudfoundry/nodejs-buildpack.git",
    "env": {
      "SYSTEM_VERSION": "${SYSTEM_VERSION}"
    }
  },
  "apps": {
    "push2cloud-example-host": {
      "routes": {
        "public": [
          "push2cloud-example-host-${space}"
        ]
      }
    },
    "push2cloud-example-api": {
      "routes": {
        "internal": [
          "${appname}-${space}"
        ]
      }
    }
  }
}

```

# schema

The schema defines the following properties:

## `name` (string, required)

Identifier for the deployment. Can stay the same for multiple deployment.

## `description` (string)

Description of the deployment.

## `version` (string, required)

The version of your deployment. Use [semver](http://semver.org/).

## `target` (object, required)

target desc

Properties of the `target` object:

### `type` (string)

target type desc

Default: `"cloudfoundry"`

### `api` (string)

target api desc

### `space` (string)

target space desc

### `org` (string)

target org desc

### `delay` (number)

target delay desc

Default: `500`

### `maxRetries` (number)

target maxRetries desc

Default: `60`

## `release` (object, required)

Properties of the `release` object:

### `name` (string)

release name desc

### `manifest` (string)

release manifest desc

### `source` (object)

source definition for the release.

Properties of the `source` object:

#### `type` (string)

Type of the source.

Default: `"git"`

#### `url` (string)

URL for the source. For git use https://

#### `referenceValue` (string)

The specific reference to retrieve from the source. For git, this can be a commit-id, tag (tags/${tag}) or branch

#### `postClone` (string)

Script to execute after the source has been cloned.

## `secureAppConnections` (boolean)

secureAppConnections desc

## `domains` (object)

Further properties are of type `string`

## `serviceMapping` (object)

Properties of the `serviceMapping` object:

### `type` (string)

### `plan` (string)

## `applicationDefaults` (object)

Properties of the `applicationDefaults` object:

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

## `apps` (object)

Properties of the `apps` object:

### `routes` (object)
