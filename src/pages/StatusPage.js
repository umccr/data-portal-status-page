import React, { useState } from "react";

import { Auth } from "aws-amplify";
import { Grid, Typography } from "@mui/material";
import Link from "@mui/material/Link";

import SequenceRunTable from "../components/sequenceRun/SequenceRunTable";
import WorkflowFilter from "../components/metadata/WorkflowFilter";
import {
  useUserContext,
} from "../components/utils/ContextLib";

function StatusPage() {
  const { user } = useUserContext();
  
  return (
    <Grid container>
      {user ? (
        <>
          <Grid item container justifyContent="center">
            <Typography variant="h4" gutterBottom>
              Status Page
            </Typography>
          </Grid>
          <Grid item>
            {/* Query Search useContext */}

              <WorkflowFilter />
              <SequenceRunTable />
          </Grid>
        </>
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

export default StatusPage;
