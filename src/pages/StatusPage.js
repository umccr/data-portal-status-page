import React from "react";

import { Grid, Typography } from "@mui/material";

import SequenceRunTable from "../components/sequenceRun/SequenceRunTable";
import WorkflowFilter from "../components/metadata/WorkflowFilter";

function StatusPage() {
  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Status Page
        </Typography>
      </Grid>
      <Grid item>

        {/* Wrap Filter component to be assesible by child */}
        <WorkflowFilter>
          <SequenceRunTable />
        </WorkflowFilter>
      </Grid>
    </>
  );
}

export default StatusPage;
