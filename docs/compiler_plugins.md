# Compiler Plugins

Throughout the [compiler](compiler.md) there are multiple hooks where a user can provide custom code to change the behavior and result. Which plugins are used is defined at invocation time in the [CLI](cli.md)

All plugins export an object with one or multiple of the following keys:

# `afterPrepare`
`afterPrepare (dir, cb)` is executed after all manifests have been retrieved in the prepare phase.

`dir` points to the temporary directory where all manifests are stored.

`cb(err)` needs to be invoked after the plugin is done.

# `afterGetReleaseManifest`
`afterGetReleaseManifest (dir, releaseManifest, cb)` is executed after the release manifest has been retrieved in the prepare phase.

`dir` points to the temporary directory where all manifests are stored.

`releaseManifest` contains the whole releaseManifest.

`cb(err, releaseManifest)` needs to be invoked after the plugin is done. The releaseManifest object passed to the callback will replace the previous one.

# `afterGetDeploymentManifest`
`afterGetDeploymentManifest (dir, deploymentManifest, cb)` is executed after the deployment manifest manifest has been retrieved in the prepare phase.

`dir` points to the temporary directory where all manifests are stored.

`deploymentManifest` contains the whole deploymentManifest.

`cb(err, deploymentManifest)` needs to be invoked after the plugin is done. The deploymentManifest object passed to the callback will replace the previous one.

# `getFile`
`getFile (ctx)` is used to retrieve a single file. The file will not get renamed and the whole path of `file` will be used.

```js
{
  repo: 'git@github.com:push2cloud/push2cloud.git',
  reference: 'master',
  target: '/tmp/push2cloud/__manifests',
  file: 'example/apps/host/package.json'
}
```
`repo` is the URL of a repository where to get the `file`.

`reference` points to which reference in the repo where to find `file` (in git: branch/tag/commit).

`target` points to the directory where to put the `file`.

`file` points to the file within the repository to retrieve.

# `getFileAs`
`getFileAs (ctx)` is used to retrieve a file and rename it in the process.

```js
ctx: {
  repo: 'git@github.com:push2cloud/push2cloud.git',
  reference: 'master',
  targetDir: '/tmp/push2cloud/__manifests',
  targetFile: '/tmp/push2cloud/__manifests/releaseManifest.json',
  file: 'example/manifests/release.json'
}
```

`ctx.repo` is the URL of a repositoy where to get the `file`.

`ctx.reference` points to which reference in the repo where to find `file` (in git: branch/tag/commit).

`ctx.targetDir` points to the directory where to put the `file`.

`ctx.targetFile` points to the path where to put the `file`.

`ctx.file` points to the file within the repository to retrieve.


# `getSource`

`getSource (app, target)` retrieves the source for an app.

```js
app: {
  source: {
    type: 'git',
    url: 'git@github.com.com:push2cloud/push2cloud.git',
    path: 'example/apps/host',
    referenceValue: 'master'
  }
}
```

`app.source.type` describes the version control system used.

`app.source.url` describes the url of the repositoy

`app.source.path` describes where within the repository the app is located

`app.source.referenceValue` points to which reference in the repo where to find `file` (in git: branch/tag/commit).

`target` points to the directory where the retrieved source should be copied to.

# `postAction`
`postAction (source, rootDir, repoHash, deployConfig, tools)` runs postClone scripts in a retrieved repository


```js
source: {
  postClone: "grunt build"
} 
```

`source.postClone` contains the script to run for this source.

`rootDir` describes the root directory of the repository.

`repoHash` contains the hash of the source of the repository

`deployConfig` contains the complete deploymentConfig

```js
tools: {
  executeScript (script)
}
```

`tools.executeScript` can be used to easily execute scripts.
