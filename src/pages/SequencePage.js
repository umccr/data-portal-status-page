import React from "react";

import { Grid, Typography } from "@mui/material";

import SequenceRunTable from "../components/sequenceRun/SequenceRunTable";
import WorkflowFilter from "../components/metadata/MetadataToolbar";

function SequencePage() {
  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Sequence Page
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

export default SequencePage;
