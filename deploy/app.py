#!/usr/bin/env python3
import os

# Import AWS resosurce
from aws_cdk import (
    core as cdk,
)

# Import cdk pipeline stack
from stacks.pipeline_stack import CdkPipelineStack

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
    "pipeline_artifact_bucket_name": {
        "dev": "data-portal-status-page-artifact-dev",
        "prod": "data-portal-status-page-artifact-prod"
    },
    "client_bucket_name": {
        "dev": "org.umccr.dev.data.status",
        "prod": "org.umccr.prod.data.status"
    },
    "repository_source": "umccr/data-portal-status-page",
    "branch_source": {
        "dev": "dev",
        "prod": "main"
    },
    "alias_domain_name": {
        "dev": ["status.data.dev.umccr.org"],
        "prod": ["status.data.umccr.org", "status.data.prod.umccr.org"]
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
    "DataPortalStatusPagePipeline",
    stack_name="pipeline-data-portal-status-page",
    tags={
        "stage": app_stage,
        "stack": "pipeline-data-portal-status-page"
    }
)

app.synth()
