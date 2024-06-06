import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { config } from './config';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router } from 'react-router-dom';

Amplify.configure({
  Auth: {
    Cognito: {
      // mandatorySignIn: true,
      // region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID as string,
      userPoolClientId: config.cognito.APP_CLIENT_ID as string,
      loginWith: {
        oauth: config.cognito.OAUTH as any,
      },
    },
  },
  API: {
    REST: {
      DataPortalApi: {
        endpoint: config.apiEndpoint.URL,
        region: config.cognito.REGION,
      },
    },
  },
});

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
