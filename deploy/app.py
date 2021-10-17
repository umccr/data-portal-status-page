#!/usr/bin/env python3
import os

from aws_cdk import (
    core as cdk,   
    aws_ssm as ssm
)

from stacks.predeploy import PredeploymentStack
from pipelines.cdkpipeline import CdkPipelineStack
 
app = cdk.App()

CdkPipelineStack(
  app,
  "DataPortalStatusPageCdkPipeline",
  stack_name = "cdkpipeline-data-portal-status-page",
  tags={
    "environment":"dev",
    "stack":"cdkpipeline-data-portal-status-page"
  }
)

PredeploymentStack(
  app,
  "PredeploymentStack",
  stack_name = "Predeployment-sscheck-front-end",
  tags={
    "stack":"cdkpipeline-sscheck-front-end"
  }
)

app.synth()
