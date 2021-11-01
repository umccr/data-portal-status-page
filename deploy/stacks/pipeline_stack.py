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
from .data_portal_status_page_stack import DataPortalStatusPageStack


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
                "stack": "pipeline-data-portal-status-page"
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

        # Create a pipeline for status page
        status_page_pipeline = codepipeline.Pipeline(
            self,
            "StatusPageCodePipeline",
            artifact_bucket=pipeline_artifact_bucket,
            restart_execution_on_update=True,
            cross_account_keys=False,
            pipeline_name=props["pipeline_name"][app_stage],
        )

        # Create codestar connection fileset
        code_pipeline_source = pipelines.CodePipelineSource.connection(
            repo_string=props["repository_source"],
            branch=props["branch_source"][app_stage],
            connection_arn=codestar_arn,
            trigger_on_push=True
        )


        # Grab code_pipeline_source artifact
        ArtifactMap = pipelines.ArtifactMap()
        source_artifact = ArtifactMap.to_code_pipeline(
            x=code_pipeline_source.primary_output
        )


        # Create A pipeline for cdk stack and react build
        self_mutate_pipeline = pipelines.CodePipeline(
            self,
            "CodePipeline",
            code_pipeline=status_page_pipeline,
            synth=pipelines.ShellStep(
                "CDKShellScript",
                input=code_pipeline_source,
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

        # Deploy infrastructure
        self_mutate_pipeline.add_stage(
            DataPortalStatusPageStage(
                self,
                "DataPortalStatusPageStage",
            )
        )

        front_end_bucket_arn = s3.Bucket.from_bucket_name(
            self,
            "FrontEndBucket",
            bucket_name=props["bucket_name"][app_stage]
        ).bucket_arn

        self_mutate_pipeline.build_pipeline()

        # Create CodeBuild Project 
        react_codebuild_project = codebuild.PipelineProject(
            self,
            "ProjectReactBuild",
            check_secrets_in_plain_text_env_variables=False,
            description="The project from codebuild to build react project.",
            project_name="DataPortalStatusPageReactBuild",
            environment=codebuild.BuildEnvironment(
                build_image=codebuild.LinuxBuildImage.STANDARD_5_0
            )
        )

        react_codebuild_project.add_to_role_policy(
            iam.PolicyStatement(
                actions=["ssm:GetParameter"],
                effect=iam.Effect.ALLOW,
                resources=[
                    "arn:aws:ssm:%s:%s:parameter/data_portal/status_page/*" % (
                        self.region, self.account),
                    "arn:aws:ssm:%s:%s:parameter/data_portal/client/*" % (
                        self.region, self.account)
                ]
            )
        )

        react_codebuild_project.add_to_role_policy(
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
        )

        # CodeBuild for react build script
        react_build_actions = codepipeline_actions.CodeBuildAction(
            input=source_artifact,
            project=react_codebuild_project,
            check_secrets_in_plain_text_env_variables=False,
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
            type=codepipeline_actions.CodeBuildActionType.BUILD,
            action_name="ReactBuildAction"
        )

        # Create React Build app stage
        self_mutate_pipeline.pipeline.add_stage(
            stage_name="ReactBuild",
            actions=[
                react_build_actions
            ]
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
        self_mutate_pipeline.pipeline.notify_on(
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
