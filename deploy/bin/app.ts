#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPipelineStack } from "../lib/pipeline-stack";
import * as process from "process";
import { props } from "./constants";

const accountId = process.env.CDK_DEFAULT_ACCOUNT;
const awsRegion = process.env.CDK_DEFAULT_REGION;

let appStage: string;
if (accountId === "472057503814") {
  appStage = "prod";
} else {
  appStage = "dev";
}

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
