import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import { Amplify } from "aws-amplify";

import {config} from "./config"

Amplify.configure({
  Auth: {
    Cognito: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: { 
        oauth: config.cognito.OAUTH,
      }
    },
  },
  API: {
    REST: 
      {
        "DataPortalApi":{
          endpoint: config.apiEndpoint.URL,
          region: config.cognito.REGION,
        },
      },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

