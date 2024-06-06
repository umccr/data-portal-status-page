export const props = {
  appStackName: 'data-portal-status-page-stack',
  pipelineName: {
    dev: 'data-portal-status-page',
    prod: 'data-portal-status-page',
  },
  pipelineArtifactBucketName: {
    dev: 'data-portal-status-page-artifact-dev',
    prod: 'data-portal-status-page-artifact-prod',
  },
  clientBucketName: {
    dev: 'org.umccr.dev.data.status',
    prod: 'org.umccr.prod.data.status',
  },
  repositorySource: 'umccr/data-portal-status-page',
  branchSource: {
    dev: 'dev',
    prod: 'main',
  },
  aliasDomainName: {
    dev: ['status.data.dev.umccr.org'],
    prod: ['status.data.umccr.org', 'status.data.prod.umccr.org'],
  },
};
