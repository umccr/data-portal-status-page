
# data-portal-status-page

This is the front end code for UMCCR Status Page.

The directories:
- *deploy* - It will contain the AWS cdk cloud infrastructrure. 
- *public* - Contains static files.
- *src* - The react source code.

**AWS-CDK Infrastructure**

See CDK readme at deploy directory. [CDK readme](deploy/README.md)

**React**

Prerequisite:  
The app will need to fetch data from the [data-portal-api](https://github.com/umccr/data-portal-apis). Before running this app, make sure to run the portal-api locally at `localhost:8000` (If it is run on a different port, you can change REACT_APP_DATA_PORTAL_API_DOMAIN variable at get_env.sh)  


1. Install React dependancy  
        `npm i`
2. Fetch ENV variables from AWS Systems Manager Parameter Store. (This will store environment variable needed to the terminal)  
        `source get_env.sh`
3. Start the project and will be running at *http://localhost:3000/*  
        `npm start`


