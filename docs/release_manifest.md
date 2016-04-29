# release manifest

In the release manifest, a release manager can specify the exact composition of applications and their versions that are known to work together.

# example

```json

{
  "name": "push2cloud-example",
  "description": "release manifest for push2cloud example",
  "version": "1.0.0",
  "source": {
    "type": "git",
    "url": "https://github.com/push2cloud/push2cloud.git",
    "referenceValue": "master"
  },
  "apps": {
    "push2cloud-example-host": {
      "path": "example/apps/host"
    },
    "push2cloud-example-api": {
      "path": "example/apps/api"
    }
  }
}

```

# schema

The schema defines the following properties:

## `name` (string, required)

Identifier for the release. Can stay the same for multiple releases.

## `description` (string)

Description of the release.

## `version` (string, required)

The version of your release. Use [semver](http://semver.org/). This value is exposed as SYSTEM_VERSION in all your applications.

## `source` (object)

Default source definition for all apps in this release. Can be overwritten by each app.

Properties of the `source` object:

### `type` (string)

Type of the source.

Default: `"git"`

### `url` (string)

URL for the source. For git use https://

### `referenceValue` (string)

The specific reference to retrieve from the source. For git, this can be a commit-id, tag (tags/${tag}) or branch

### `postClone` (string)

Script to execute after the source has been cloned.

## `globalServices` (array)

The object is an array with all elements of the type `string`.

## `apps` (object, required)

The applications of this release

Properties of the `apps` object:

### `path` (string)

Path where the application is located within the source

### `manifest` (string)

Name of the application manifest

Default: `"package.json"`

### `source` (object)

Source definition for this app.

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
