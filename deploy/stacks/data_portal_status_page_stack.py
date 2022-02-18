from aws_cdk import (
    core as cdk,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_ssm as ssm,
    aws_route53 as route53,
    aws_route53_targets as route53t,
    aws_certificatemanager as acm,
    aws_codebuild as codebuild,
    aws_iam as iam
)


class DataPortalStatusPageStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Defining app constants
        app_stage = self.node.try_get_context("app_stage")
        props = self.node.try_get_context("props")

        # Load SSM parameter for bucket name ( Created via Console)
        bucket_name = props["client_bucket_name"][app_stage]

        hosted_zone_id = ssm.StringParameter.from_string_parameter_name(
            self,
            "HostedZoneID",
            string_parameter_name="/hosted_zone/umccr/id"
        ).string_value

        hosted_zone_name = ssm.StringParameter.from_string_parameter_name(
            self,
            "HostedZoneName",
            string_parameter_name="/hosted_zone/umccr/name"
        ).string_value

        # Fetch existing hosted_zone
        hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "HostedZone",
            hosted_zone_id=hosted_zone_id,
            zone_name=hosted_zone_name,
        )

        # SSM parameter for AWS SNS ARN
        cert_use1_arn = ssm.StringParameter.from_string_parameter_name(
            self,
            "CertUSE1ARN",
            string_parameter_name="/data_portal/status_page/ssl_certificate_arn"
        ).string_value

        cert_use1 = acm.Certificate.from_certificate_arn(
            self,
            "FetchCertificateFromArn",
            certificate_arn=cert_use1_arn
        )

        # Creating bucket for the build directory code
        client_bucket = s3.Bucket(
            self,
            "data-portal-status-page-client-bucket",
            bucket_name=bucket_name,
            auto_delete_objects=True,
            removal_policy=cdk.RemovalPolicy.DESTROY,
            website_index_document="index.html",
            website_error_document="index.html",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL
        )

        # Create the Origin Access Identity (OAI)
        cloudfront_oai = cloudfront.OriginAccessIdentity(self, 'umccr-script-oai',
                                                         comment="Created By CDK")

        # create s3 configuration details
        s3_origin_source = cloudfront.S3OriginConfig(
            s3_bucket_source=client_bucket,
            origin_access_identity=cloudfront_oai
        )

        # setup cloudfront config for s3
        source_config = cloudfront.SourceConfiguration(
            s3_origin_source=s3_origin_source,
            behaviors=[cloudfront.Behavior(is_default_behavior=True)]
        )

        # setup error pages redirection
        error_page_configuration = cloudfront.CfnDistribution.CustomErrorResponseProperty(
            error_code=403,
            error_caching_min_ttl=60,
            response_code=200,
            response_page_path="/index.html"
        )

        # create the web distribution
        data_portal_status_page_cloudfront = cloudfront.CloudFrontWebDistribution(
            self,
            "cloud_front_name",
            origin_configs=[source_config],
            error_configurations=[error_page_configuration],
            viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            default_root_object="index.html",
            price_class=cloudfront.PriceClass.PRICE_CLASS_ALL,
            enable_ip_v6=False,
            viewer_certificate=cloudfront.ViewerCertificate.from_acm_certificate(
                certificate=cert_use1,
                aliases=props["alias_domain_name"][app_stage],
                security_policy=cloudfront.SecurityPolicyProtocol.TLS_V1,
                ssl_method=cloudfront.SSLMethod.SNI
            )
        )

        # Create A-Record to Route53
        route53.ARecord(
            self,
            "StatusPageCustomDomainAlias",
            target=route53.RecordTarget(
                alias_target=route53t.CloudFrontTarget(data_portal_status_page_cloudfront)
            ),
            zone=hosted_zone,
            record_name="status.data"
        )

        # Adding stack variable output

        # Cloudformation Distribution_id
        cdk.CfnOutput(
            self,
            'CfnOutputCloudFrontDistributionId',
            value=data_portal_status_page_cloudfront.distribution_id
        )
