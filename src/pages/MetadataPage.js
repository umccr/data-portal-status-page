import React from "react";

import { Grid, Typography } from "@mui/material";

import MetadataAction from "../components/metadata/MetadataAction";
import MetadataToolbar from "../components/metadata/MetadataToolbar";

function MetadataPage() {
  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Metadata Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MetadataToolbar>
          <MetadataAction />
        </MetadataToolbar>
      </Grid>
    </>
  );
}

export default MetadataPage;
