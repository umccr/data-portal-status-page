import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkPipelineStack } from '../lib/pipeline-stack';
import { props } from '../bin/constants';

test('Pipeline Stack Test', () => {
  const app = new cdk.App({
    context: {
      app_stage: 'dev',
      props: props,
    },
  });

  const stack = new CdkPipelineStack(app, 'TestPipelineStack', {
    env: {
      account: '123456789012', // Your AWS Account ID
      region: 'ap-southeast-2',
    },
  });

  const template = Template.fromStack(stack);

  // Test if S3 bucket for pipeline artifacts is created
  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: 'data-portal-status-page-artifact-dev',
  });

  // Test if CodePipeline is created with expected properties
  const pipelines = template.findResources('AWS::CodePipeline::Pipeline');
  const pipelineLogicalId = Object.keys(pipelines)[0];
  expect(pipelines[pipelineLogicalId].Properties.ArtifactStore.Location.Ref).toMatch(
    /^dataportalstatuspageartifactbucket/
  );

  // Test if CodeBuild Project for React build is created
  const codeBuildProjects = template.findResources('AWS::CodeBuild::Project');
  const codeBuildProjectLogicalId = Object.keys(codeBuildProjects).find(
    (id) => codeBuildProjects[id].Properties.Name === 'DataPortalStatusPageReactBuild'
  );
  expect(codeBuildProjectLogicalId).toBeDefined();

  // Test if the pipeline stage for React build is created
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([
      Match.objectLike({
        Name: 'ReactBuild',
        Actions: Match.arrayWith([
          Match.objectLike({
            Name: 'ReactBuildAction',
            ActionTypeId: {
              Category: 'Build',
              Owner: 'AWS',
              Provider: 'CodeBuild',
              Version: '1',
            },
            Configuration: {
              ProjectName: {
                Ref: codeBuildProjectLogicalId,
              },
            },
          }),
        ]),
      }),
    ]),
  });

  // Test if the notification rule for SNS is created
  template.hasResourceProperties('AWS::CodeStarNotifications::NotificationRule', {
    Name: 'SlackNotificationStatusPagePipeline',
    DetailType: 'BASIC',
    EventTypeIds: [
      'codepipeline-pipeline-pipeline-execution-failed',
      'codepipeline-pipeline-pipeline-execution-succeeded',
    ],
    Targets: [
      Match.objectLike({
        TargetAddress: Match.objectLike({
          Ref: Match.stringLikeRegexp('^SsmParameterValuedataportalbackendnotificationsnstopicarn'),
        }),
        TargetType: 'SNS',
      }),
    ],
  });
});
