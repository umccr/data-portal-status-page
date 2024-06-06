import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { DataPortalStatusPageStack } from '../lib/data-portal-status-page-stack';
import { props } from '../bin/constants';

test('DataPortalStatusPageStack Test', () => {
  const app = new cdk.App({
    context: {
      app_stage: 'dev',
      props: props,
    },
  });

  const stack = new DataPortalStatusPageStack(app, 'TestDataPortalStatusPageStack', {
    env: {
      account: '123456789012',
      region: 'ap-southeast-2',
    },
  });

  const template = Template.fromStack(stack);

  // Test if the S3 bucket is created with expected properties
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'org.umccr.dev.data.status',
    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: 'index.html',
    },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
  });

  // Test if CloudFront distribution is created with expected properties
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Origins: Match.arrayWith([
        Match.objectLike({
          S3OriginConfig: {
            OriginAccessIdentity: {
              'Fn::Join': [
                '',
                [
                  'origin-access-identity/cloudfront/',
                  Match.objectLike({
                    Ref: Match.stringLikeRegexp('^umccrscriptoai'),
                  }),
                ],
              ],
            },
          },
        }),
      ]),
      DefaultCacheBehavior: {
        ViewerProtocolPolicy: 'redirect-to-https',
      },
      ViewerCertificate: {
        SslSupportMethod: 'sni-only',
        MinimumProtocolVersion: 'TLSv1',
        AcmCertificateArn: Match.objectLike({
          Ref: Match.stringLikeRegexp('^SsmParameterValuedataportalstatuspage'),
        }),
      },
    },
  });

  // Test if Route53 A record is created
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Type: 'A',
    AliasTarget: {
      DNSName: {
        'Fn::GetAtt': [Match.stringLikeRegexp('^cloudfrontnameCFDistribution'), 'DomainName'],
      },
    },
  });
});
