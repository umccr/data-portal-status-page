const REGION = process.env.REACT_APP_REGION;
const OAUTH_DOMAIN = `${process.env.REACT_APP_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

// Regex for isLocal configuration
const isLocal = /localhost/.test(process.env.REACT_APP_DATA_PORTAL_API_DOMAIN);

export const config = {
  apiEndpoint: {
    URL: isLocal
      ? `http://${process.env.REACT_APP_DATA_PORTAL_API_DOMAIN}`
      : `https://${process.env.REACT_APP_DATA_PORTAL_API_DOMAIN}`,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: process.env.REACT_APP_COG_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COG_APP_CLIENT_ID,
    signUpVerificationMethod: 'code',
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scopes: ["email", "aws.cognito.signin.user.admin", "openid", "profile"],
      redirectSignIn: [process.env.REACT_APP_OAUTH_REDIRECT_IN],
      redirectSignOut: [process.env.REACT_APP_OAUTH_REDIRECT_OUT],
      responseType: "code",
    },
  },
};
