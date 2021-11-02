from typing import Text
from aws_cdk import (
    core as cdk,   
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_ssm as ssm,
    aws_route53 as route53,
    aws_route53_targets as route53t,
    aws_certificatemanager as acm
)

class PredeploymentStack(cdk.Stack):
    """The stack is meant to deploy manually once before any other stack"""

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Defining app constants
        app_stage = self.node.try_get_context("app_stage")
        props = self.node.try_get_context("props")

        # --- Query deployment env specific config from SSM Parameter Store
        # Query existing UMCCR domain

        umccr_domain = ssm.StringParameter.from_string_parameter_name(
            self,
            "DomainName",
            string_parameter_name="umccr_domain",
        ).string_value

        cert_use1 = acm.Certificate(
            self,
            "SSLCertificateUSE1StatusPage",
            domain_name= "status.data." + umccr_domain,
            subject_alternative_names=props["alias_domain_name"][app_stage],
            validation=acm.CertificateValidation.from_dns()
        )

        # Create ARN for cert_use1 created above
        ssm.StringParameter(
            self,
            "StatusPageSSLCertificateARN",
            string_value=cert_use1.certificate_arn,
            tier=ssm.ParameterTier.STANDARD,
            description="SSL Certificate ARN for data-portal-status-page",
            parameter_name="/data_portal/status_page/ssl_certificate_arn",
        )



    