from aws_cdk import (
    core as cdk,
    aws_ssm as ssm,
)


class PredeploymentStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, constants=None, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create SSM Paramter for the bucket name used on the CloudFront
        ssm.StringParameter(self, "bucketName",
                            allowed_pattern=".*",
                            description="The Bucket Name for the React code to live",
                            parameter_name="/data_portal/status_page/bucket_name",
                            string_value="data-portal-status-page-front-end-code-dev",
                            # Potsfix may be modified to depend stage
                            tier=ssm.ParameterTier.STANDARD
                            )
