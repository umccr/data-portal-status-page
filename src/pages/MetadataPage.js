import React, { useState, useEffect } from "react";

import { Grid, Typography, TableContainer, Paper } from "@mui/material";
// import { useLocation } from "react-router-dom";
// Custom Components
import MetadataTable from "../components/metadata/MetadataTable";
import WorkflowFilter from "../components/metadata/WorkflowFilter";
import { useSearchContext } from "../components/higherOrderComponent/SearchContextProvider";

// // A custom hook that builds on useLocation to parse
// // the query string
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function MetadataPage() {
  const [metadataList, setMetadataList] = useState([]);
  const { queryResult } = useSearchContext();

  useEffect(() => {
    if (queryResult.metadataSearch) {
      setMetadataList(queryResult.metadataSearch);
    }
  }, [queryResult]);

  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Metadata Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {/* Query Search useContext */}

        <WorkflowFilter>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ borderRadius: "10px" }}
          >
            <MetadataTable metadataList={metadataList} />
          </TableContainer>
        </WorkflowFilter>
      </Grid>
    </>
  );
}

export default MetadataPage;
