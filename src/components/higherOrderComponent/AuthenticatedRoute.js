import React from "react";

import { Auth } from "aws-amplify";
import { Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";

import { useUserContext } from "./UserContextProvider";

function AuthenticatedRoute(props) {
  const { user } = useUserContext();
  return (
    <Grid container>
      {user ? (
        props.children
      ) : (
        <>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            sx={{ paddingTop: "100px" }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome to UMCCR Portal Status Page!
            </Typography>
            <Typography align="center" sx={{ paddingTop: "25px" }}>
              <Link
                variant="h1"
                sx={{ fontSize: "16px" }}
                gutterBottom
                onClick={() => Auth.federatedSignIn({ provider: "Google" })}
              >
                Please login
              </Link>
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default AuthenticatedRoute;
