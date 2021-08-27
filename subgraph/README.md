# Subgraph

## Installation

- `yarn` to install dependencies
- Validate configurations in `./config`
- `yarn codegen`
- `yarn prepare:{NETWORK}` to prepare the `subgraph.{NETWORK}.yaml` manifest (see `package.json`)

## Deployment

### Local

- Will need to setup a local graph-node, see https://github.com/graphprotocol/graph-node/
- `yarn create:local && yarn deploy:local`

### Hosted Service

- Will need to create an account on `https://thegraph.com/` (for the hosted service!), and create a subgraph from your dashboard. Note that this account will be created with your GitHub instead of your wallet
- `yarn graph auth --product hosted-service {ACCESS_TOKEN}`, where the access token is given to you on your dashboard
- `GITHUB_NAME=github_name SUBGRAPH_NAME=subgraph_name yarn deploy:{NETWORK}` to deploy to the hosted service. Make sure that the GitHub name and the subgraph name match to the names from your account
