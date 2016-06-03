# push2cloud CLI

# general
```
Usage: p2c <command> [options]

Commands:
  exec     Execute a workflow.
  compile  Compile the manifests to a deploymentconfig.
  lint     Lint the manifests.
  ls       List manifests/workflows/schemas.

Options:
  -h, --help  Show help                                                [boolean]
```

# compile

```

p2c compile [options]

Options:
  -h, --help, --help        Show help                                        [boolean]
  -e, --deploymentManifest  path to the deploymentManifest                   [default: "./deploymentManifest.json"]
  -c, --clearWorkspace      clears the __workspace directory before building [default: false]
  --settings                Path to JSON config file                         [default: "./push2cloud-config.json"]
```


# execute
```

Usage: p2c exec <workflow> [options]

Options:
  -h, --help, --help  Show help                                        [boolean]
  --settings          Path to JSON config file                         [default: "./push2cloud-config.json"]
```

# environment variables
```

The following global environment variables are available

variables:
  DEBUG                                                                [string] "*" shows all debug messages
```

# configuration
All configuration takes place in the [push2cloud-config.json](https://github.com/push2cloud/push2cloud/blob/master/example/deployer/push2cloud-config.json), e.g.:

```js
{
  "plugins": {
    "prepare": [
      "push2cloud-compiler-git-no-archive",
      "push2cloud-compiler-cf-target-env",
      "push2cloud-compiler-git-ref-env"
    ],
    "compile": [
      "push2cloud-compiler-cf-app-connections",
      "push2cloud-compiler-cf-app-versioning"
    ],
    "buildWorkspace": [
      "push2cloud-compiler-git-no-archive",
      "push2cloud-compiler-workspace-resolver"
    ]
  }
}
```
