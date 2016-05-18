# Adopting your Apps to fully leverage push2cloud
All context for your application is provided via environment variables. Therefore you need to adapt your application to read the information from its environment.

# generic environment variables
The environment variables you define in the application or deployment manifest are set as regular environment variables. No special handling is required. This includes environment variables that are looked up and replaced via the secret store.

# Application connections
Depending on how you define an `appConnection` in your applications manifest you will get different environment variables.

## minimalistic example
```json
{
  "appConnections": {
    "push2cloud-example-api": {}
  }
}

```

A minimalistic `appConnection` declaration will just put the first exposed route of the target appliaction in your application, suffixed with `_HOST`. In the example above, this would result in `PUSH2CLOUD_EXAMPLE_API_HOST` being set.

Note: the protocol used (`http` or `https`) is controlled by the `secureAppConnections` boolean in the deployment manifest.

## additional urls

```json
"appConnections": {
  "push2cloud-example-api": {
    "urls": {
      "LOGIN_URL": "/login"
    }
  }
}

```
In this more advanced example, an additional environment variable `LOGIN_URL` will be set to the first exposed route of the target application, suffixed with `/login`.

## credentials

```json
"appConnections": {
  "push2cloud-example-api": {
    "injectCredentials": true
  }
}
```
If you set the `injectCredentials` boolean, two additional environment variables will be set: `PUSH2CLOUD_EXAMPLE_API_USERNAME` and `PUSH2CLOUD_EXAMPLE_API_PASSWORD`. The values of for those variables are taken from the target applications environments `USERNAME` and `PASSWORD` variables.

# Service Bindings
Service bindings are provided by the platform itself. In CloudFoundry, the service information is provided via the `VCAP_SERVICES` variable and looks like this:

```json
"VCAP_SERVICES": {
 "redis": [
  {
   "credentials": {
    "host": "xxx",
    "password": "xxx",
    "port": 50000
   },
   "label": "redis",
   "name": "todo-db",
   "plan": "small",
   "tags": []
  }
 ]
}

```

How you parse the service binding information will differ depending on the platform you deploy to. For CloudFoundry, you might want to use a library to make the parsing easier, such as [node-cfenv](https://github.com/cloudfoundry-community/node-cfenv).
