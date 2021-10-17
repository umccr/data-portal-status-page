import React, { useState } from "react";

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
        {/* Query Search useContext */}

        <WorkflowFilter />
        <SequenceRunTable />
      </Grid>
    </>
  );
}

export default StatusPage;
