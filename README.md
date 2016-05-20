# push2cloud
Deploy complex applications in style!

## Overview
push2cloud is a framework that allows you to easily deploy complex applications onto Cloud Foundry. push2cloud consists of multiple pluggable components that work together to give maximum customizability to the user and use-case.

## Architecture
The basic push2cloud architecture consists of manifests, the compiler to process them and various workflows to deploy. A complete overview of the architecture can be found [here](docs/architecture.md).

## Getting started
```bash
# get push2cloud
git clone https://github.com/push2cloud/push2cloud.git
cd push2cloud/example/deployer
npm install

# install the cli
npm install -g push2cloud-cli

# set your CF target (api, space, org)
vi ../manifests/deployment.json

# set your CF credentials
export CF_USER=${YOUR_USER}
export CF_PWD=${YOUR_PASSWORD}

# compile
p2c compile -e ../manifests/deployment.json

# deploy
p2c exec ./node_modules/push2cloud-cf-workflows/simple.js
```

Longer and commented version available [here](guides/getting_started.md). Further guides available [here](guides/guide_list.md).


## Demo
This quick demo shows you the initial deployent of the demo app and a blue-green deployment after a few changes.
![Push2Cloud in action](docs/gfx/blue_green.gif)

longer and slower video [here](https://www.youtube.com/watch?v=-4CHDhGYhAc)

## Contribute
To report bugs or request features, submit issues here on GitHub, push2cloud/push2cloud/issues. If you're contributing code, make pull requests to the appropriate repositories (see the [repo overview](docs/repositories.md)). If you're contributing something substantial, you should first contact developers.

## License
push2cloud is licensed under the Apache License version 2.0. See the file LICENSE.
