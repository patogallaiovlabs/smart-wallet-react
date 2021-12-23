# Getting Started 

This project is a POC with the goal of integrating Smart Wallets and Aztec protocol.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Graph

Terminal 1:
- `cd graph & docker-compose up`

Terminal 2 (Optional - only first time deploy, or redeploy of subgraph) :
- `cd graph`
- `graph codegen subgraph.yaml --debug --output-dir ./types`
- `graph create smart-wallet-graph --node http://127.0.0.1:8020`
- `graph deploy smart-wallet-graph subgraph.yaml --debug --ipfs http://localhost:5001 --node http://127.0.0.1:8020 -l v1`

Terminal 3:
- `yarn start`


## TO-DO

- `npm i patch-package`
    - Prefix: `REACT_APP_` for `REACT_APP_LOCAL_DATABASE_PATH`
- Note: Metadata
- Revisar eth-sig-util, encrypt.
- Encrypt/Decrypt:
    - https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
    - Warning with encrypting, length matters, we should pad in order to hide.
