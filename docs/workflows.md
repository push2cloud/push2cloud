# Workflows
A workflow is a collection of steps to migrate from one state to another in a reproducible fashion. Usually, this migration is done from the state that is currently deployed to a new desired state.

## Workflow Utilities
Push2Cloud comes with various [workflow utilities](workflow_utils.md). They range from wrapping a single function into a reusable step to a waterfall control flow and utilities to `diff` two data structures.

## Example: Simple Workflow
This [simple workflow](https://github.com/push2cloud/cf-workflows/blob/master/simple.js) demonstrates the steps to deploy applications into an empty space. It consists of an outer part that executes the various steps as a waterfall (outputs of the first are parameters for the second). The set function is used to bind parameters to the context that is passed within the waterfall.

```js
const simple = (deploymentConfig, api, log) =>
  waterfall(
    [ step((ctx, cb) => api.init(cb), null, 'current')
    , set('desired', deploymentConfig)
    , map(packageApp, appsToDeploy)
    , mapSeries(api.createServiceInstance, services)
    , map(api.createRoute, routes)
    , map(api.createApp, appsToDeploy)
    , mapLimit(api.uploadApp, appsToDeploy)
    , map(api.setEnv, envVars)
    , map(api.bindService, serviceBindings)
    , map(api.startApp, appsToDeploy)
    , map(api.associateRoute, unAssociatedRoutes)
    ]
 );
```

## Example: BlueGreen Workflow
This more [advanced example](https://github.com/push2cloud/cf-workflows/blob/master/blueGreen.js) shows how to migrate applications without downtime using a [blue-green deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html).

```js
const blueGreen = (deploymentConfig, api, log) =>
  waterfall(
    [ init(deploymentConfig, api, log)
    , map(packageApp, missing.apps)
    , mapSeries(api.createServiceInstance, missing.services)
    , map(api.createRoute, missing.routes)
    , map(api.createApp, missing.apps)
    , mapLimit(api.uploadApp, missing.apps)
    , map(api.setEnv, missing.envVars)
    , map(api.stageApp, missing.apps)
    , map(api.bindService, missing.serviceBindings)
    , map(api.startAppAndWaitForInstances, missing.apps)
    , map(api.associateRoute, missing.unAssociatedRoutes)
    , map(switchRoutes(api), combine('desired.routes', old.associatedRoutes, (r) => (r.unversionedName + r.hostname + r.domain)))
    , ensureRunning(api)
    , map(api.stopApp, old.apps)
    , map(api.unbindService, old.serviceBindings)
    , map(api.deleteApp, old.apps)
    ]
 );

```
