#!/usr/bin/env python3
import os

from aws_cdk import (
    core as cdk,   
    aws_ssm as ssm
)
from pipelines.cdkpipeline import CdkPipelineStack

account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')
aws_env = {'account': account_id , 'region': aws_region}

 
app = cdk.App()



CdkPipelineStack(
  app,
  "DataPortalStatusPageCdkPipeline",
  stack_name = "cdkpipeline-data-portal-status-page",
  env=aws_env,
  tags={
    "environment":"dev",
    "stack":"cdkpipeline-data-portal-status-page"
  }
)

app.synth()
