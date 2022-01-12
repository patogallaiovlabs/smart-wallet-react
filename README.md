# Getting Started 

This project is a POC with the goal of integrating Smart Wallets and Aztec protocol.

## Getting started
0. Pre-requisites
1. Start *RSKj* Node
2. Start *Graph DB* Node

### 0. Pre-requisites
1. Docker
1. Node/NPM
1. Yarn
1. Graph Cli : https://thegraph.com/docs/en/developer/quick-start/#1-install-the-graph-cli

### 1. Start *RSKj* Node

Inside the `rsknode` folder you will find all related the configuration of a regtest node running on your local machine.
So to start the node, we can do execute this command:
- `cd rsknode && docker-compose up`

### 2. Start *Graph DB*
Inside the `graph` folder you will find all related the configuration of a graph node over a postgresdb dockerized on your local machine.
So to start the db, we can do execute this command:
- `cd graph && docker-compose up`

Once up and running, we have to deploy the subgraph that we are gonna use in the app.

First command is to create the subgraph:
- `graph create smart-wallet-graph  --node http://127.0.0.1:8020`
- Where *http://127.0.0.1:8020* is the address of the graph node

Then, the second command is for deploying de schema and config of events we are going to track:
- `cd graph && graph deploy smart-wallet-graph subgraph.yaml  --debug --ipfs  http://localhost:5001  --node http://127.0.0.1:8020  -l v1`
- You can check more details in [`graph/subgraph.yaml`](graph/subgraph.yaml)

### 3. Deploy the protocol/contracts

We have 3 differents set of contract:
- Smart wallet related contracts
- ERC20 contracts *(Testing porpuse only, in the future we can link to a real ERC20 token, like RDOC or DOC)*
- Aztec protocol contracts

So we have to deploy them in the next order:
- `yarn run truffle-migrate-smart`
- `yarn run truffle-migrate-erc20`
- `yarn run truffle-migrate-aztec`

For truffle config you can check each of the files here:
- [Smart Wallet](./contracts/smart-wallet/truffle-config.js)
- [Erc20](./contracts/erc20test/truffle-config.js)
- [Aztec](./contracts/aztec/truffle-config.js)



### Start the App

In the project directory, you can run:

#### - `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### - `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\

## CONGRATS!
Your app is ready!


## TO-DO
- Integrate with the forked version of Aztec 1.0 ([code here](https://github.com/patogallaiovlabs/AZTEC/tree/develop_rsk)) 
    - `npm i patch-package`
        - Prefix: `REACT_APP_` for `REACT_APP_LOCAL_DATABASE_PATH`
