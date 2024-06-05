# UMCCR client CDK for Data Status Page

This cdk will build an AWS cloud infrastructure for the UMCCR Data Status Page.

The directories:

- _stacks_ - Contains the applications stack

## Resources

- **AWS cloudfront**  
   Access s3 bucket react code
- **AWS S3 bucket**  
   Store react build code
- **Route 53**  
   Setup DNS for the samplesheet check for cloudfront

# Setting up

It is recomended to create a virtual environment for the app.

To do so please follow the instruction below.

Change your directory to the root of this readme file.

```
$ cd deploy
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ npm install
```

# Stack Deployment

**Prerequisite**

- A valid SSL Certificate in `us-east-1` region at ACM for all the domain name needed. See [here](app.py#L42) (`alias_domain_name` on the props variable) on what domain need to be included, determined based on which account is deployed.
- SSM Parameter for the certificate ARN created above with the name of `/data_portal/status_page/ssl_certificate_arn`

_Deploying the stack without prerequisite above may result in a stack rollback_

There are 2 stacks in this application:

- _data_portal_status_page_ - Contains the applications stack
- _pipeline_ - Contains the pipeline for the stack to run and self update

To deploy the application stack, you will need to deploy the `pipeline` stack. The pipeline stack will take care of the `data_portal_status_page` stack deployment.

Deploy pipeline stack

```
$ cdk deploy DataPortalStatusPagePipeline --profile=dev
```

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
