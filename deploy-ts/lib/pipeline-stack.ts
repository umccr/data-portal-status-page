import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as iam from "aws-cdk-lib/aws-iam";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as sns from "aws-cdk-lib/aws-sns";
import * as codestarnotifications from "aws-cdk-lib/aws-codestarnotifications";
import * as pipelines from "aws-cdk-lib/pipelines";

import { Construct } from "constructs";
import { DataPortalStatusPageStack } from "./data-portal-status-page-stack";

interface DataPortalStatusPageStageProps extends cdk.StageProps {
  appStage: string;
  props: { [key: string]: any };
}

class DataPortalStatusPageStage extends cdk.Stage {
  constructor(
    scope: Construct,
    id: string,
    props: DataPortalStatusPageStageProps
  ) {
    super(scope, id, props);

    const { appStage, props: appProps } = props;
    const stackName = appProps["appStackName"];

    new DataPortalStatusPageStack(this, "StatusPage", {
      stackName: stackName,
      tags: {
        stage: appStage,
        stack: `pipeline-${stackName}`,
      },
      appStage: appStage,
      props: {
        clientBucketName: appProps["clientBucketName"],
        aliasDomainName: appProps["aliasDomainName"],
      },
    });
  }
}

interface CdkPipelineStackProps extends cdk.StackProps {
  appStage: string;
  props: { [key: string]: any };
}

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkPipelineStackProps) {
    super(scope, id, props);

    const { appStage, props: appProps } = props;

    const codestarArn = ssm.StringParameter.valueForStringParameter(
      this,
      "codestar_github_arn"
    );

    const pipelineArtifactBucket = new s3.Bucket(
      this,
      "data-portal-status-page-artifact-bucket",
      {
        bucketName: appProps["pipelineArtifactBucketName"][appStage],
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      }
    );

    const statusPagePipeline = new codepipeline.Pipeline(
      this,
      "StatusPageCodePipeline",
      {
        artifactBucket: pipelineArtifactBucket,
        restartExecutionOnUpdate: true,
        crossAccountKeys: false,
        pipelineName: appProps["pipelineName"][appStage],
      }
    );

    const codePipelineSource = pipelines.CodePipelineSource.connection(
      appProps["repository_source"],
      appProps["branchSource"][appStage],
      {
        connectionArn: codestarArn,
        triggerOnPush: true,
      }
    );

    const sourceArtifact = new codepipeline.Artifact();

    const selfMutatePipeline = new pipelines.CodePipeline(
      this,
      "CodePipeline",
      {
        codePipeline: statusPagePipeline,
        synth: new pipelines.ShellStep("CDKShellScript", {
          input: codePipelineSource,
          commands: [
            "cdk synth",
            "mkdir ./cfnnag_output",
            'for template in $(find ./cdk.out -type f -maxdepth 2 -name "*.template.json"); do cp $template ./cfnnag_output; done',
            "cfn_nag_scan --input-path ./cfnnag_output",
          ],
          installCommands: [
            "cd deploy",
            "npm install -g aws-cdk",
            "gem install cfn-nag",
            "npm install",
          ],
          primaryOutputDirectory: "deploy/cdk.out",
        }),
      }
    );

    selfMutatePipeline.addStage(
      new DataPortalStatusPageStage(this, "DataPortalStatusPageStage", {
        appStage: appStage,
        props: appProps,
      })
    );

    const frontEndBucketArn = s3.Bucket.fromBucketName(
      this,
      "FrontEndBucket",
      appProps["clientBucketName"][appStage]
    ).bucketArn;

    selfMutatePipeline.buildPipeline();

    const reactCodebuildProject = new codebuild.PipelineProject(
      this,
      "ProjectReactBuild",
      {
        description: "The project from codebuild to build react project.",
        projectName: "DataPortalStatusPageReactBuild",
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        },
      }
    );

    reactCodebuildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        effect: iam.Effect.ALLOW,
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/data_portal/status_page/*`,
          `arn:aws:ssm:${this.region}:${this.account}:parameter/data_portal/client/*`,
        ],
      })
    );

    reactCodebuildProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject",
        ],
        effect: iam.Effect.ALLOW,
        resources: [frontEndBucketArn, `${frontEndBucketArn}/*`],
      })
    );

    const reactBuildActions = new codepipeline_actions.CodeBuildAction({
      actionName: "ReactBuildAction",
      project: reactCodebuildProject,
      input: sourceArtifact,
      environmentVariables: {
        REACT_APP_REGION: {
          value: "ap-southeast-2",
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
        REACT_APP_BUCKET_NAME: {
          value: appProps["clientBucketName"][appStage],
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        },
        REACT_APP_UMCCR_DOMAIN_NAME: {
          value: "/hosted_zone/umccr/name",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_DATA_PORTAL_API_DOMAIN: {
          value: "/data_portal/backend/api_domain_name",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_COG_USER_POOL_ID: {
          value: "/data_portal/client/cog_user_pool_id",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_COG_APP_CLIENT_ID: {
          value: "/data_portal/status_page/cog_app_client_id_stage",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_OAUTH_DOMAIN: {
          value: "/data_portal/client/oauth_domain",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_OAUTH_REDIRECT_IN: {
          value: "/data_portal/status_page/oauth_redirect_in_stage",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        REACT_APP_OAUTH_REDIRECT_OUT: {
          value: "/data_portal/status_page/oauth_redirect_out_stage",
          type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
        },
      },
      checkSecretsInPlainTextEnvVariables: false,
      type: codepipeline_actions.CodeBuildActionType.BUILD,
    });

    selfMutatePipeline.pipeline.addStage({
      stageName: "ReactBuild",
      actions: [reactBuildActions],
    });

    const codebuildBuildInvalidateProject = new codebuild.PipelineProject(
      this,
      "CodebuildProjectInvalidateStatsPageCDNCache",
      {
        projectName: "InvalidateDataPortalStatusPageCDNCache",
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            build: {
              commands: [
                `DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name ${appProps["appStackName"]} --query 'Stacks[0].Outputs[?OutputKey==\`CfnOutputCloudFrontDistributionId\`].OutputValue' --output text)`,
                'aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"',
              ],
            },
          },
        }),
        timeout: cdk.Duration.minutes(5),
        queuedTimeout: cdk.Duration.minutes(5),
      }
    );

    codebuildBuildInvalidateProject.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [
          `arn:aws:cloudfront::${process.env.CDK_DEFAULT_ACCOUNT}:distribution/*`,
        ],
        actions: ["cloudfront:CreateInvalidation"],
      })
    );

    codebuildBuildInvalidateProject.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [
          `arn:aws:cloudformation:ap-southeast-2:${process.env.CDK_DEFAULT_ACCOUNT}:stack/${appProps["appStackName"]}/*`,
        ],
        actions: ["cloudformation:DescribeStacks"],
      })
    );

    const codebuildActionClearCache = new codepipeline_actions.CodeBuildAction({
      actionName: "InvalidateCloudFrontCache",
      project: codebuildBuildInvalidateProject,
      input: sourceArtifact,
      checkSecretsInPlainTextEnvVariables: false,
    });

    selfMutatePipeline.pipeline.addStage({
      stageName: "CleanUpStage",
      actions: [codebuildActionClearCache],
    });

    const dataPortalNotificationSnsArn =
      ssm.StringParameter.valueForStringParameter(
        this,
        "/data_portal/backend/notification_sns_topic_arn"
      );

    const dataPortalSnsNotification = sns.Topic.fromTopicArn(
      this,
      "DataPortalSNS",
      dataPortalNotificationSnsArn
    );

    selfMutatePipeline.pipeline.notifyOn(
      "SlackNotificationStatusPage",
      dataPortalSnsNotification,
      {
        events: [
          codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
          codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
        ],
        detailType: codestarnotifications.DetailType.BASIC,
        enabled: true,
        notificationRuleName: "SlackNotificationStatusPagePipeline",
      }
    );
  }
}
