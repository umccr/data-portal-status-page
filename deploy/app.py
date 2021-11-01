#!/usr/bin/env python3
import os

# Import AWS resosurce
from aws_cdk import (
    core as cdk,
)

# Import cdk pipeline stack
from pipelines.cdkpipeline import CdkPipelineStack

# Account environment and region
account_id = os.environ.get('CDK_DEFAULT_ACCOUNT')
aws_region = os.environ.get('CDK_DEFAULT_REGION')

# Determine account stage (Identify if it is running on prod or dev)
if account_id == "472057503814":  # Account number used for production environment
    app_stage = "prod"
else:
    app_stage = "dev"


props = {
    "pipeline_name": {
        "dev": "data-portal-status-page",
        "prod": "data-portal-status-page"
    },
    "bucket_name": {
        "dev": "org.umccr.dev.data.status",
        "prod": "org.umccr.prod.data.status"
    },
    "repository_source": "data-portal-status-page",
    "branch_source": {
        "dev": "dev",
        "prod": "main"
    },
    "alternative_domain_name":{
        "dev": [],
        "prod": ["status.data.umccr.org"]
    }
}

app = cdk.App(
    context={
        "app_stage": app_stage,
        "props": props
    }
)

CdkPipelineStack(
    app,
    "DataPortalStatusPageCdkPipeline",
    stack_name="cdkpipeline-data-portal-status-page",
    tags={
        "stage": app_stage,
        "stack": "cdkpipeline-data-portal-status-page"
    }
)


app.synth()
