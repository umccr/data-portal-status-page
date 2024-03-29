
# data-portal-status-page

This is the front end code for UMCCR Status Page.

### Online Deployment

Production : https://status.data.umccr.org/  
Development: https://status.data.dev.umccr.org/

### Development

The directories:
- *deploy* - It will contain the AWS cdk cloud infrastructrure. 
- *public* - Contains static files.
- *src* - The react source code.

Prerequisite:  
The app will need to fetch data from the [data-portal-api](https://github.com/umccr/data-portal-apis). Before running this app, make sure to run the portal-api locally at `localhost:8000` (If it is run on a different port, you can change REACT_APP_DATA_PORTAL_API_DOMAIN variable at get_env.sh)  


1. Check Node version, as our project need run with version >= 18
        `node -v`
2. Install React dependancy  
        `npm i`
3. Fetch ENV variables from AWS Systems Manager Parameter Store. (This will store environment variable needed to the terminal)  
        `source get_env.sh`
4. Start the project and will be running at *http://localhost:3000/*  
        `npm start`

### AWS-CDK Infrastructure

See CDK readme at deploy directory. [CDK readme](deploy/README.md)
