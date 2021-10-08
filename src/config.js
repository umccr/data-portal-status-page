const REGION = process.env.REACT_APP_REGION;
const OAUTH_DOMAIN = `${process.env.REACT_APP_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

const DATA_PORTAL_API = `https://${process.env.REACT_APP_DATA_PORTAL_API_DOMAIN}`;

export const config = {
  // endpoint for backend
  apiEndpoint: {
    URL: DATA_PORTAL_API,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: process.env.REACT_APP_COG_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COG_APP_CLIENT_ID,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scope: ["email", "aws.cognito.signin.user.admin", "openid", "profile"],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_OUT,
      responseType: "code",
    },
  },
};
