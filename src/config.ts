const REGION = import.meta.env.VITE_REGION;
const OAUTH_DOMAIN = `${import.meta.env.VITE_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

// Regex for isLocal configuration
const isLocal = /localhost/.test(import.meta.env.VITE_DATA_PORTAL_API_DOMAIN || '');

export const config = {
  apiEndpoint: {
    URL: isLocal
      ? `http://${import.meta.env.VITE_DATA_PORTAL_API_DOMAIN}`
      : `https://${import.meta.env.VITE_DATA_PORTAL_API_DOMAIN}`,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: import.meta.env.VITE_COG_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_COG_APP_CLIENT_ID,
    signUpVerificationMethod: 'code',
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scopes: ['email', 'aws.cognito.signin.user.admin', 'openid', 'profile'],
      redirectSignIn: [import.meta.env.VITE_OAUTH_REDIRECT_IN],
      redirectSignOut: [import.meta.env.VITE_OAUTH_REDIRECT_OUT],
      responseType: 'code',
    },
  },
};
