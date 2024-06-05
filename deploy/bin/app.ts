#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPipelineStack } from "../lib/pipeline-stack";
import * as process from "process";

const accountId = process.env.CDK_DEFAULT_ACCOUNT;
const awsRegion = process.env.CDK_DEFAULT_REGION;

let appStage: string;
if (accountId === "472057503814") {
  appStage = "prod";
} else {
  appStage = "dev";
}

const props = {
  appStackName: "data-portal-status-page-stack",
  pipelineName: {
    dev: "data-portal-status-page",
    prod: "data-portal-status-page",
  },
  pipelineArtifactBucketName: {
    dev: "data-portal-status-page-artifact-dev",
    prod: "data-portal-status-page-artifact-prod",
  },
  clientBucketName: {
    dev: "org.umccr.dev.data.status",
    prod: "org.umccr.prod.data.status",
  },
  repositorySource: "umccr/data-portal-status-page",
  branchSource: {
    dev: "dev",
    prod: "main",
  },
  aliasDomainName: {
    dev: ["status.data.dev.umccr.org"],
    prod: ["status.data.umccr.org", "status.data.prod.umccr.org"],
  },
};

const app = new cdk.App({
  context: {
    app_stage: appStage,
    props: props,
  },
});

new CdkPipelineStack(app, "DataPortalStatusPagePipeline", {
  stackName: "pipeline-data-portal-status-page",
  tags: {
    stage: appStage,
    stack: "pipeline-data-portal-status-page",
  },
  env: {
    account: accountId,
    region: awsRegion,
  },
});

app.synth();
