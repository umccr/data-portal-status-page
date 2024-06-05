import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_ssm as ssm,
  aws_route53 as route53,
  aws_route53_targets as route53t,
  aws_certificatemanager as acm,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class DataPortalStatusPageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appStage = this.node.tryGetContext("app_stage");
    const appProps = this.node.tryGetContext("props");

    const bucketName = appProps["clientBucketName"][appStage];

    const hostedZoneId = ssm.StringParameter.valueForStringParameter(
      this,
      "/hosted_zone/umccr/id"
    );

    const hostedZoneName = ssm.StringParameter.valueForStringParameter(
      this,
      "/hosted_zone/umccr/name"
    );

    // Fetch existing hosted_zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId,
        zoneName: hostedZoneName,
      }
    );

    // SSM parameter for AWS Cert ARN
    const certUse1Arn = ssm.StringParameter.valueForStringParameter(
      this,
      "/data_portal/status_page/ssl_certificate_arn"
    );

    const certUse1 = acm.Certificate.fromCertificateArn(
      this,
      "FetchCertificateFromArn",
      certUse1Arn
    );

    // Creating bucket for the build directory code
    const clientBucket = new s3.Bucket(
      this,
      "data-portal-status-page-client-bucket",
      {
        bucketName: bucketName,
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "index.html",
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      }
    );

    // Create the Origin Access Identity (OAI)
    const cloudfrontOai = new cloudfront.OriginAccessIdentity(
      this,
      "umccr-script-oai",
      {
        comment: "Created By CDK",
      }
    );

    // create s3 configuration details
    const s3OriginSource: cloudfront.S3OriginConfig = {
      s3BucketSource: clientBucket,
      originAccessIdentity: cloudfrontOai,
    };

    // setup cloudfront config for s3
    const sourceConfig: cloudfront.SourceConfiguration = {
      s3OriginSource: s3OriginSource,
      behaviors: [{ isDefaultBehavior: true }],
    };

    // setup error pages redirection
    const errorPageConfiguration: cloudfront.CfnDistribution.CustomErrorResponseProperty =
      {
        errorCode: 403,
        errorCachingMinTtl: 60,
        responseCode: 200,
        responsePagePath: "/index.html",
      };

    const dataPortalStatusPageCloudfront =
      new cloudfront.CloudFrontWebDistribution(this, "cloud_front_name", {
        originConfigs: [sourceConfig],
        errorConfigurations: [errorPageConfiguration],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        defaultRootObject: "index.html",
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        enableIpV6: false,
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certUse1,
          {
            aliases: appProps["aliasDomainName"][appStage],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
            sslMethod: cloudfront.SSLMethod.SNI,
          }
        ),
      });

    // Create A-Record to Route53
    new route53.ARecord(this, "StatusPageCustomDomainAlias", {
      target: route53.RecordTarget.fromAlias(
        new route53t.CloudFrontTarget(dataPortalStatusPageCloudfront)
      ),
      zone: hostedZone,
      recordName: "status.data",
    });

    // Adding stack variable output

    // Cloudformation Distribution_id
    new cdk.CfnOutput(this, "CfnOutputCloudFrontDistributionId", {
      value: dataPortalStatusPageCloudfront.distributionId,
    });
  }
}
