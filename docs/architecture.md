# push2cloud Architecture
This document covers the various pieces of push2cloud.
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

  - [Manifests](#manifests)
    - [Deployment Manifest](#deployment-manifest)
    - [Release Manifest](#release-manifest)
    - [Application Manifest](#application-manifest)
  - [Compiler](#compiler)
    - [Phases](#phases)
      - [Prepare](#prepare)
      - [compile](#compile)
      - [build](#build)
    - [Deployment Configuration](#deployment-configuration)
  - [Workflows](#workflows)
  - [Adapters](#adapters)
- [Further Reading](#further-reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

  - Manifests
  - Compiler
  - Workflows

## Manifests
There are currently three kinds of manifests: deployment, release and application. In the application manifest a developer defines the application, its dependencies on other applications, services and environment variables that should be set. In the release manifest, a release manager can specify the exact composition of applications and their versions that are known to work together. In the deployment manifest, the deployment target specific information is defined, such as domain and service mappings. Some short example to illustrate how those manifests work together:


An application needs to talk to an additional application to deliver some data. A new appConnection to the desired application is added. No changes to the release manifest are required as the composition of applications does not change. No changes in the deployment manifest are needed.

A new application and its manifest is created. The new application is needs to be added to the release manifest. The deployment manifest needs to be adapted if the application requires new route or service mappings.

The same release should be deployed onto a second CloudFoundry installation. The new installation has a different domain, service types and plans. No changes to the application or release manifest are required. A new deployment manifest is created to reflect the new domain, service types and plans.


### Deployment Manifest
The [deployment manifest](deployment_manifest.md) is the starting point for the compiler. This manifest specifies where to deploy a release. Further features include domain mappings, route definitions, service mappings, application defaults and app-specific overwrites.

```json
{
  "name": "example",
  "description": "deployment manifest for push2cloud example",
  "target": {
    "type": "cloudfoundry",
    "api": "https://api.my-cf-provider.com",
    "space": "production",
    "org": "push2cloud",
  },
  "release": {
    "name": "example",
    "source": {
      "type": "git",
      "url": "git@github.com:push2cloud/push2cloud.git",
      "referenceValue": "master"
    },
    "manifest": "example/manifests/release.json"
  },
  ...
}
```

### Release Manifest
The [release manifest](release_manifest.md) describes the composition of various applications. Further features include the definition of global services (mapped to all apps) and scripts that are executed after the repository has been cloned.

```json
{
  "name": "example-app",
  "description": "release manifest for push2cloud example",
  "version": "1.0.0",
  "source": {
    "type": "git",
    "url": "git@github.com:push2cloud/push2cloud.git",
    "referenceValue": "master",
  },
  "apps": {
    "api": {
      "path": "example/apps/api"
    },
    "host": {
      "path": "example/apps/host"
    }
  },
  ...
}
```

### Application Manifest
The [application manifest](application_manifest.md) describes the application, its environment variables, service bindings and application connections.

```json
{
  "name": "api",
  "version": "1.0.0",
  "deployment": {
    "env": {
      "MODE": "PRODUCTION",
    },
    "serviceBinding": [
      "todo-db"
    ],
    "appConnections": {
      "db-gateway": {
        "injectCredentials": true
      }
    }
  },
  ...
}
```


## Compiler
The [compiler](compiler.md) retrieves and consumes various manifests and compiles them into a deployment configuration. The compilation itself is separated into multiple phases. Each phase can be easily extended via [plugins](compiler_plugins.md).


### Phases
The compile process is structured into three phases that run in series.
![compiler](gfx/compiler.png)
#### Prepare
In the first phase, all required manifests are retrieved. The source for the release manifest is defined in the deployment manifest, the source for applications can either be configured globally in the release manifest or overwritten on a per-app basis. The manifests are stored locally on the filesystem.

#### compile
With all the manifests present, the compiler performs a series tasks. The output of this phase is the deployment configuration.

#### build
If scripts are specified in either the applications or the release manifest, these scripts are executed on a local workspace. This phase can be used to prepare the applications for deployment.

### Deployment Configuration
The [deployment configuration](deployment_configuration.md) is the output of the compiler. It contains all required information for the workflow in a easy to iterate format.

```json
{
	"version": "1.0.0",
	"target": {
    ...
	},
	"services": [
    {
			"type": "redis",
			"plan": "small",
			"name": "todo-db"
		}
	],
	"apps": [
		{
			"name": "push2cloud-example-api-1.0.0",
			"version": "1.0.0",
			"memory": 256,
			"disk": 256,
			"instances": 1,
      ...
		},
    ...
	],
	"envVars": [
    {
			"name": "push2cloud-example-host-1.0.0",
			"env": {
				"SYSTEM_VERSION": "1.0.0",
				"push2cloud_EXAMPLE_API_HOST": "https://push2cloud-example-api-iot-cf-test.scapp.io"
			}
		},
    ...
	],
  "serviceBindings": [
		{
			"app": "push2cloud-example-api-1.0.0",
			"service": "todo-db",
		}
	],
	"routes": [
		{
			"app": "push2cloud-example-host-1.0.0",
			"domain": "scapp.io",
			"hostname": "push2cloud-example-host-iot-cf-test",
		},
		...
	]
	...		
}
```

## Workflows
A workflow is a collection of steps to migrate from one state to another in a reproducible fashion. Usually, this migration is done from the state that is currently deployed to a new desired state.

Push2Cloud [workflows](docs/workflows.md) are imperative by design. Instead of describing steps in an arbitrarily-complex language, steps are code. This allows absolute flexibility. Customization can be done right in the actual workflow, instead of some abstractions away. Workflow utilities are provided for various control flow challenges in the.

## Adapters
Push2Cloud comes with an [CloudFoundry adapter](docs/cf-adapter.md). This allows users to easily interact with CloudFoundry in Workflows. The adapter can also be used as a standalone component.

# Further Reading
While this document covers the basic architecture of push2cloud, many features and capabilities were left out. Use the following links to get to more in-depth guides to the relevant topics:

  - [Deployment manifest](deployment_manifest.md)
  - [Release manifest](release_manifest.md)
  - [Application manifest](application_manifest.md)
  - [Compiler](compiler.md)
  - [Compiler plugins](compiler_plugins.md)
  - [Deployment configuration](deployment_configuration.md)
  - [Workflows](workflows.md)
  - [Workflow utils](workflow_utils.md)
  - [CLI configuration](cli.md)

Once you feel comfortable with you understanding of push2clouds inner workings, see those guides to get you starting:

  - [Getting started](../guides/getting_started.md)
  - [Adopting your applications to fully leverage push2cloud](../guides/adopting_your_app.md)
  - [How to create a compiler plugin](../guides/compiler_plugins_howto.md)
  - [How to create a workflow](../guides/workflow_howto.md)
  - [How to use push2cloud with your existing CI pipeline](../guides/ci_cd_pipeline.md)
