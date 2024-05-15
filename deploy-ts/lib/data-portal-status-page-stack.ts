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

interface DataPortalStatusPageStackProps extends cdk.StackProps {
  appStage: string;
  props: {
    clientBucketName: { [key: string]: string };
    aliasDomainName: { [key: string]: string };
  };
}

export class DataPortalStatusPageStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: DataPortalStatusPageStackProps
  ) {
    super(scope, id, props);

    const { appStage, props: appProps } = props;

    const bucketName = appProps.clientBucketName[appStage];

    const hostedZoneId = ssm.StringParameter.valueForStringParameter(
      this,
      "/hosted_zone/umccr/id"
    );

    const hostedZoneName = ssm.StringParameter.valueForStringParameter(
      this,
      "/hosted_zone/umccr/name"
    );

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: hostedZoneId,
        zoneName: hostedZoneName,
      }
    );

    const certUse1Arn = ssm.StringParameter.valueForStringParameter(
      this,
      "/data_portal/status_page/ssl_certificate_arn"
    );

    const certUse1 = acm.Certificate.fromCertificateArn(
      this,
      "FetchCertificateFromArn",
      certUse1Arn
    );

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

    const cloudfrontOai = new cloudfront.OriginAccessIdentity(
      this,
      "umccr-script-oai",
      {
        comment: "Created By CDK",
      }
    );

    const s3OriginSource: cloudfront.S3OriginConfig = {
      s3BucketSource: clientBucket,
      originAccessIdentity: cloudfrontOai,
    };

    const sourceConfig: cloudfront.SourceConfiguration = {
      s3OriginSource: s3OriginSource,
      behaviors: [{ isDefaultBehavior: true }],
    };

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
            aliases: [appProps.aliasDomainName[appStage]],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
            sslMethod: cloudfront.SSLMethod.SNI,
          }
        ),
      });

    new route53.ARecord(this, "StatusPageCustomDomainAlias", {
      target: route53.RecordTarget.fromAlias(
        new route53t.CloudFrontTarget(dataPortalStatusPageCloudfront)
      ),
      zone: hostedZone,
      recordName: "status.data",
    });

    new cdk.CfnOutput(this, "CfnOutputCloudFrontDistributionId", {
      value: dataPortalStatusPageCloudfront.distributionId,
    });
  }
}
