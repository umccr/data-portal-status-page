# importing modules
from aws_cdk import (
    aws_ssm as ssm,
    pipelines,
    core as cdk,
    aws_codepipeline as codepipeline,
    aws_s3 as s3,
    aws_codepipeline_actions as codepipeline_actions,
    aws_iam as iam,
    aws_codebuild as codebuild,
    aws_sns as sns,
    aws_codestarnotifications as codestarnotifications
)
from stacks.data_portal_status_page import DataPortalStatusPageStack


class DataPortalStatusPageStage(cdk.Stage):
    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        app_stage = self.node.try_get_context("app_stage")

        # Create stack defined on stacks folder
        DataPortalStatusPageStack(
            self,
            "StatusPage",
            stack_name="data-portal-status-page-stack",
            tags={
                "stage": app_stage,
                "stack": "cdkpipeline-data-portal-status-page"
            }
        )


# Class for the CDK pipeline stack


class CdkPipelineStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Defining app stage
        app_stage = self.node.try_get_context("app_stage")
        props = self.node.try_get_context("props")

        # Load SSM parameter for GitHub repo (Created via Console)
        codestar_arn = ssm.StringParameter.from_string_parameter_attributes(self, "codestarArn",
                                                                            parameter_name="codestar_github_arn"
                                                                            ).string_value

        # Create S3 bucket for artifacts
        pipeline_artifact_bucket = s3.Bucket(
            self, 
            "data-portal-status-page-client-bucket", 
            bucket_name = "data-portal-status-page-artifact-dev",
            auto_delete_objects = True,
            removal_policy = cdk.RemovalPolicy.DESTROY,
            block_public_access= s3.BlockPublicAccess.BLOCK_ALL
        )

        source_artifact = codepipeline.Artifact(
            artifact_name="data_portal_status_page_source_artifact",
        )

        # Fetch github repository for changes
        code_star_action = codepipeline_actions.CodeStarConnectionsSourceAction(
            connection_arn=codestar_arn,
            output=source_artifact,
            owner="umccr",
            repo=props["repository_source"],
            branch=props["branch_source"][app_stage],
            action_name="Source",
            trigger_on_push=True
        )

        # Create a pipeline for status page
        status_page_pipeline = codepipeline.Pipeline(
            self,
            "StatusPageCodePipeline",
            artifact_bucket=pipeline_artifact_bucket,
            restart_execution_on_update=True,
            cross_account_keys=False,
            pipeline_name=props["pipeline_name"][app_stage],

        )

        # Source Stage
        status_page_pipeline.add_stage(
            stage_name="StatusPageGitHubSource",
            actions=[code_star_action]
        )

        # Create A pipeline for cdk stack and react build
        self_mutate_pipeline = pipelines.CodePipeline(
            self,
            "CodePipeline",
            code_pipeline=status_page_pipeline,
            synth=pipelines.ShellStep(
                "CDKShellScript",
                commands=[
                    "cdk synth",
                    "mkdir ./cfnnag_output",
                    "for template in $(find ./cdk.out -type f -maxdepth 2 -name '*.template.json'); do cp $template ./cfnnag_output; done",
                    "cfn_nag_scan --input-path ./cfnnag_output"
                ],
                install_commands=[
                    "cd deploy",
                    "npm install -g aws-cdk",
                    "gem install cfn-nag",
                    "pip install -r requirements.txt"
                ],
                primary_output_directory="deploy/cdk.out"
            )
        )

        front_end_bucket_arn = s3.Bucket.from_bucket_name(
            self,
            "FrontEndBucket",
            bucket_name=props["bucket_name"][app_stage]
        ).bucket_arn

        # Deploy infrastructure
        status_page_pipeline.add_stage(
            DataPortalStatusPageStage(
                self,
                "DataPortalStatusPageStage",
            )
        )



        # TODO: Create CodeBuild to build React Code
        # Below Implementation using CDK Pipeline API to is deprecated
        # https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_pipelines.CdkPipeline.html

        # # Create React Build app stage
        # react_build_stage = status_page_pipeline.pipeline.add_stage(
        #     stage_name="ReactBuild",
        #     actions=[pipelines.ShellScriptAction(
        #         action_name="BuildScript",
        #         environment_variables={
        #             "REACT_APP_REGION": codebuild.BuildEnvironmentVariable(
        #                 value="ap-southeast-2",
        #                 type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
        #             ),
        #             "REACT_APP_BUCKET_NAME": codebuild.BuildEnvironmentVariable(
        #                 value=props["bucket_name"][app_stage],
        #                 type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
        #             ),
        #             "REACT_APP_DATA_PORTAL_API_DOMAIN": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/backend/api_domain_name",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #             "REACT_APP_COG_USER_POOL_ID": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/client/cog_user_pool_id",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #             "REACT_APP_COG_APP_CLIENT_ID": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/status_page/cog_app_client_id_stage",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #             "REACT_APP_OAUTH_DOMAIN": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/client/oauth_domain",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #             "REACT_APP_OAUTH_REDIRECT_IN": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/status_page/oauth_redirect_in_stage",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #             "REACT_APP_OAUTH_REDIRECT_OUT": codebuild.BuildEnvironmentVariable(
        #                 value="/data_portal/status_page/oauth_redirect_out_stage",
        #                 type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
        #             ),
        #         },
        #         commands=[
        #             "env | grep REACT",
        #             "npm i react-scripts",
        #             "npm run build",
        #             "npm run deploy"
        #         ],
        #         role_policy_statements=[
        #             iam.PolicyStatement(
        #                 actions=["ssm:GetParameter"],
        #                 effect=iam.Effect.ALLOW,
        #                 resources=[
        #                     "arn:aws:ssm:%s:%s:parameter/data_portal/status_page/*" % (
        #                         self.region, self.account),
        #                     "arn:aws:ssm:%s:%s:parameter/data_portal/client/*" % (
        #                         self.region, self.account)
        #                 ]
        #             ),
        #             iam.PolicyStatement(
        #                 actions=[
        #                     "s3:DeleteObject",
        #                     "s3:GetObject",
        #                     "s3:ListBucket",
        #                     "s3:PutObject"
        #                 ],
        #                 effect=iam.Effect.ALLOW,
        #                 resources=[
        #                     front_end_bucket_arn,
        #                     front_end_bucket_arn + "/*"
        #                 ]
        #             )
        #         ]
        #     )]
        # )


        # react_build_stage.add_actions(
            # pipelines.ShellScriptAction(
            #     action_name="BuildScript",
            #     environment_variables={
            #         "REACT_APP_REGION": codebuild.BuildEnvironmentVariable(
            #             value="ap-southeast-2",
            #             type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
            #         ),
            #         "REACT_APP_BUCKET_NAME": codebuild.BuildEnvironmentVariable(
            #             value=props["bucket_name"][app_stage],
            #             type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
            #         ),
            #         "REACT_APP_DATA_PORTAL_API_DOMAIN": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/backend/api_domain_name",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #         "REACT_APP_COG_USER_POOL_ID": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/client/cog_user_pool_id",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #         "REACT_APP_COG_APP_CLIENT_ID": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/status_page/cog_app_client_id_stage",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #         "REACT_APP_OAUTH_DOMAIN": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/client/oauth_domain",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #         "REACT_APP_OAUTH_REDIRECT_IN": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/status_page/oauth_redirect_in_stage",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #         "REACT_APP_OAUTH_REDIRECT_OUT": codebuild.BuildEnvironmentVariable(
            #             value="/data_portal/status_page/oauth_redirect_out_stage",
            #             type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
            #         ),
            #     },
            #     commands=[
            #         "env | grep REACT",
            #         "npm i react-scripts",
            #         "npm run build",
            #         "npm run deploy"
            #     ],
            #     additional_artifacts=[source_artifact],
            #     role_policy_statements=[
            #         iam.PolicyStatement(
            #             actions=["ssm:GetParameter"],
            #             effect=iam.Effect.ALLOW,
            #             resources=[
            #                 "arn:aws:ssm:%s:%s:parameter/data_portal/status_page/*" % (
            #                     self.region, self.account),
            #                 "arn:aws:ssm:%s:%s:parameter/data_portal/client/*" % (
            #                     self.region, self.account)
            #             ]
            #         ),
            #         iam.PolicyStatement(
            #             actions=[
            #                 "s3:DeleteObject",
            #                 "s3:GetObject",
            #                 "s3:ListBucket",
            #                 "s3:PutObject"
            #             ],
            #             effect=iam.Effect.ALLOW,
            #             resources=[
            #                 front_end_bucket_arn,
            #                 front_end_bucket_arn + "/*"
            #             ]
            #         )
            #     ]
            # )
        # )

        # # SSM parameter for AWS SNS ARN
        # data_portal_notification_sns_arn = ssm.StringParameter.from_string_parameter_attributes(
        #     self,
        #     "DataPortalSNSArn",
        #     parameter_name="/data_portal/backend/notification_sns_topic_arn"
        # ).string_value

        # # SNS chatbot
        # data_portal_sns_notification = sns.Topic.from_topic_arn(
        #     self,
        #     "DataPortalSNS",
        #     topic_arn=data_portal_notification_sns_arn
        # )

        # # Add Chatbot Notificaiton
        # pipeline.code_pipeline.notify_on(
        #     "SlackNotificationStatusPage",
        #     target=data_portal_sns_notification,
        #     events=[
        #         codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
        #         codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED
        #     ],
        #     detail_type=codestarnotifications.DetailType.BASIC,
        #     enabled=True,
        #     notification_rule_name="SlackNotificationStatusPagePipeline"
        # )
