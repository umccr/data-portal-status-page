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

        cloud_artifact = codepipeline.Artifact(
            artifact_name="data_portal_status_page_pipeline_cloud"
        )

        source_artifact = codepipeline.Artifact(
            artifact_name="data_portal_status_page_pipeline_source",
        )

        # Fetch github repository for changes
        code_star_action = codepipeline_actions.CodeStarConnectionsSourceAction(
            connection_arn=codestar_arn,
            output=source_artifact,
            owner="umccr",
            repo=props["repository_source"],
            branch=props["branch_source"][app_stage],
            action_name="Source"
        )

        # Create CDK pipeline
        pipeline = pipelines.CdkPipeline(
            self,
            "CDKPipeline",
            cloud_assembly_artifact=cloud_artifact,
            pipeline_name=props["pipeline_name"][app_stage],
            source_action=code_star_action,
            cross_account_keys=False,
            synth_action=pipelines.SimpleSynthAction(
                synth_command="cdk synth",
                cloud_assembly_artifact=cloud_artifact,
                source_artifact=source_artifact,
                install_commands=[
                    "npm install -g aws-cdk",
                    "gem install cfn-nag",
                    "pip install -r requirements.txt"
                ],
                test_commands=[
                    "cdk synth",
                    "mkdir ./cfnnag_output",
                    "for template in $(find ./cdk.out -type f -maxdepth 2 -name '*.template.json'); do cp $template ./cfnnag_output; done",
                    "cfn_nag_scan --input-path ./cfnnag_output"
                ],
                action_name="Synth",
                project_name="data-portal-status-page-synth",
                subdirectory="deploy"
            )

        )

        # Deploy infrastructure
        pipeline.add_application_stage(
            DataPortalStatusPageStage(
                self,
                "DataPortalStatusPageStage",
            )
        )

        react_build_stage = pipeline.add_stage(
            stage_name="ReactBuild",
        )

        front_end_bucket_arn = s3.Bucket.from_bucket_name(
            self,
            "FrontEndBucket",
            bucket_name=props["bucket_name"][app_stage]
        ).bucket_arn

        react_build_stage.add_actions(
            pipelines.ShellScriptAction(
                action_name="BuildScript",
                environment_variables={
                    "REACT_APP_REGION": codebuild.BuildEnvironmentVariable(
                        value="ap-southeast-2",
                        type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
                    ),
                    "REACT_APP_BUCKET_NAME": codebuild.BuildEnvironmentVariable(
                        value=props["bucket_name"][app_stage],
                        type=codebuild.BuildEnvironmentVariableType.PLAINTEXT
                    ),
                    "REACT_APP_DATA_PORTAL_API_DOMAIN": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/backend/api_domain_name",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                    "REACT_APP_COG_USER_POOL_ID": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/client/cog_user_pool_id",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                    "REACT_APP_COG_APP_CLIENT_ID": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/status_page/cog_app_client_id_stage",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                    "REACT_APP_OAUTH_DOMAIN": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/client/oauth_domain",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                    "REACT_APP_OAUTH_REDIRECT_IN": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/status_page/oauth_redirect_in_stage",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                    "REACT_APP_OAUTH_REDIRECT_OUT": codebuild.BuildEnvironmentVariable(
                        value="/data_portal/status_page/oauth_redirect_out_stage",
                        type=codebuild.BuildEnvironmentVariableType.PARAMETER_STORE
                    ),
                },
                commands=[
                    "env | grep REACT",
                    "npm i react-scripts",
                    "npm run build",
                    "npm run deploy"
                ],
                additional_artifacts=[source_artifact],
                role_policy_statements=[
                    iam.PolicyStatement(
                        actions=["ssm:GetParameter"],
                        effect=iam.Effect.ALLOW,
                        resources=[
                            "arn:aws:ssm:%s:%s:parameter/data_portal/status_page/*" % (
                                self.region, self.account),
                            "arn:aws:ssm:%s:%s:parameter/data_portal/client/*" % (
                                self.region, self.account)
                        ]
                    ),
                    iam.PolicyStatement(
                        actions=[
                            "s3:DeleteObject",
                            "s3:GetObject",
                            "s3:ListBucket",
                            "s3:PutObject"
                        ],
                        effect=iam.Effect.ALLOW,
                        resources=[
                            front_end_bucket_arn,
                            front_end_bucket_arn + "/*"
                        ]
                    )
                ]
            )
        )

        # SSM parameter for AWS SNS ARN
        data_portal_notification_sns_arn = ssm.StringParameter.from_string_parameter_attributes(
            self,
            "DataPortalSNSArn",
            parameter_name="/data_portal/backend/notification_sns_topic_arn"
        ).string_value

        # SNS chatbot
        data_portal_sns_notification = sns.Topic.from_topic_arn(
            self,
            "DataPortalSNS",
            topic_arn=data_portal_notification_sns_arn
        )

        # Add Chatbot Notificaiton
        pipeline.code_pipeline.notify_on(
            "SlackNotificationStatusPage",
            target=data_portal_sns_notification,
            events=[
                codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                codepipeline.PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED
            ],
            detail_type=codestarnotifications.DetailType.BASIC,
            enabled=True,
            notification_rule_name="SlackNotificationStatusPagePipeline"
        )
