import React from "react";

import { Route } from "react-router-dom";
import { signInWithRedirect } from "aws-amplify/auth";
import { Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";

import { useUserContext } from "./UserContextProvider";

function AuthenticatedRoute(props) {
  const { children, ...rest } = props;
  const { user } = useUserContext();
  return (
    <Route {...rest}>
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
                  onClick={() => signInWithRedirect({ provider: "Google" })}
                >
                  Please login
                </Link>
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Route>
  );
}

export default AuthenticatedRoute;
