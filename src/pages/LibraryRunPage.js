import React from "react";

import { Grid, Typography } from "@mui/material";

import LibraryRunAction from "../components/libraryRun/LibraryRunAction";
import MetadataToolbar from "../components/metadata/MetadataToolbar";

function LibraryRunPage() {
  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Library Run Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MetadataToolbar>
          <LibraryRunAction />
        </MetadataToolbar>
      </Grid>
    </>
  );
}

export default LibraryRunPage;
