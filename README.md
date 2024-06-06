# data-portal-status-page

This is the front end code for UMCCR Status Page.

## Online Deployment

Production : <https://status.umccr.org/>  
Development: <https://status.dev.umccr.org/>

## Development

The directories:

- _deploy_ - It will contain the AWS cdk cloud infrastructrure.
- _public_ - Contains static files.
- _src_ - The react source code.

Prerequisite:  
The app will need to fetch data from the [data-portal-api](https://github.com/umccr/data-portal-apis).
Before running this app, make sure to run the portal-api locally at `localhost:8000` (If it is run on a different port, you can change VITE_DATA_PORTAL_API_DOMAIN variable at get_env.sh)

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

### Lint & prettier

- Run lint: `yarn lint`
- Run prettier check: `yarn prettier`
- Run prettier fix: `yarn prettier-fix`

### Audit

- Run `yarn audit` for package security vulnerabilities
- Recommend fixing/updating any package with _direct_ dependencies
- If vulnerabilities found in transitive dependency, but it has yet to resolve, then list them in `package.json > resolutions` node as [Selective Dependency Resolutions condition explained here](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/).

### Pre-commit Hook

> NOTE: We use [pre-commit](https://github.com/umccr/wiki/blob/master/computing/dev-environment/git-hooks.md). It will guard and enforce static code analysis such as `lint` and any security `audit` via pre-commit hook. You are encouraged to fix those. If you wish to skip this for good reason, you can by-pass [Git pre-commit hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) by using `git commit --no-verify` flag.

```commandline
git config --unset core.hooksPath
pre-commit install
pre-commit run --all-files
```

### AWS-CDK Infrastructure

This cdk will build an AWS cloud infrastructure for the UMCCR Data Status Page. See CDK readme at deploy directory. [CDK readme](deploy/README.md)
