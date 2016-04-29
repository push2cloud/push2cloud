# Getting started with Push2Cloud

## Intro
All components of Push2Cloud are hosted on Github (Source) and can also be installed via NPM. To get you started quickly, there is an example deployer in this repository. A deployer in this context is just a package.json file that lets you install all dependencies in a simple fashion.

## Step 1: Clone the repository
As mentioned above, first we get the deployer using git.
```bash
# get push2cloud
git clone https://github.com/push2cloud/push2cloud.git
```

## Step 2: Install dependencies
Next, we install all required components for the example deployment via NPM.
```bash
cd push2cloud/example/deployer
npm install
```

## Step 3: Configure your deployment target
Next, we you need to adopt the deployment manifest for your CloudFoundry target. Make sure to use an empty space so your existing applications are not impacted. Open the file in an editor of your choice.
``` 
vi ../manifests/deployment.json
``` 
Adopt the following values:

```js
{
  ...
  "target": {
    "api": "https://api.lyra-836.appcloud.swisscom.com",
    "space": "${SPACE}",
    "org": "${ORG}",
    ...
  }
  "serviceMapping": {
    "*-db" : {
      "type": "${REDIS_TYPE}",
      "plan": "${REDIS_PLAN}"
    }
  },

  ...
}
```
Note: this example uses a Redis database. Gather the `type` and `plan` from your CloudFoundry provider. The example will still display the website without a Redis database, but your data will not be persisted.

## Step 4: Configure your deployment credentials
The workflow we are going to use reads your CloudFoundry credentials out of the environment variables. Export your username and password exactly the same way as you would for the CloudFoundry-CLI:

```bash
export CF_USER=${YOUR_USER}
export CF_PWD=${YOUR_PASSWORD}
```
## Step 5:
Before we start the deployment, we need to run the compiler. This creates the required deployment configuration and prepares the local workspace for packaging.

```bash
node_modules/.bin/p2c compile -e ../manifests/deployment.json
```

Alternativly, you can install the p2c globally
```bash
npm install -g push2cloud-cli
p2c compile -e ../manifests/deployment.json
```

## Step 6:
Finally, we are ready to deploy the example application. Simply start the execution of a workflow:

```
node_modules/.bin/p2c exec ./node_modules/push2cloud-cf-workflows/blueGreen.js
```

You should now have two applications and a service running in your space:

```bash
# cf a
Getting apps in org ${ORG} / space ${SPACE} as ${USER}...
OK

name                            requested state   instances   memory   disk   urls
push2cloud-example-api-1.0.0    started           1/1         512M     512M   push2cloud-example-api-${SPACE}.${DOMAIN}
push2cloud-example-host-2.0.0   started           1/1         512M     1G     push2cloud-example-host-${SPACE}.${DOMAIN}

# cf s
Getting services in org ${ORG} / space ${SPACE} as ${USER}...
OK

name                    service    plan    bound apps                     last operation
todo-db                 redis      small   push2cloud-example-api-1.0.0   create succeeded
``` 
