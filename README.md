# data-portal-status-page

This is the front end code for UMCCR Status Page.

## Online Deployment

Production : https://status.data.umccr.org/  
Development: https://status.data.dev.umccr.org/

## Development

The directories:

- _deploy_ - It will contain the AWS cdk cloud infrastructrure.
- _public_ - Contains static files.
- _src_ - The react source code.

Prerequisite:  
The app will need to fetch data from the [data-portal-api](https://github.com/umccr/data-portal-apis).
Before running this app, make sure to run the portal-api locally at `localhost:8000` (If it is run on a different port, you can change REACT_APP_DATA_PORTAL_API_DOMAIN variable at get_env.sh)

### TL;DR

```
node -v
v18.19.0

npm i -g yarn

(NOTE: yarn should auto resolve to local version from `.yarn` that configure in `package.json` > `packageManager`)
yarn -v
1.22.22

yarn install

aws sso login --profile dev && export AWS_PROFILE=dev

yarn start

(CTRL+C to stop the dev server)
```

### AWS-CDK Infrastructure

See CDK readme at deploy directory. [CDK readme](deploy/README.md)
