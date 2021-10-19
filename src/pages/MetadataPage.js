import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";
import { useLocation } from "react-router-dom";

import {
  Grid,
  Typography,
  TableContainer,
  Paper,
  LinearProgress,
} from "@mui/material";

// Custom Components
import Pagination from "../components/utils/Pagination";
import MetadataTable from "../components/metadata/MetadataTable";
import WorkflowFilter from "../components/metadata/WorkflowFilter";
import { useDialogContext } from "../components/higherOrderComponent/DialogComponent";

// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MetadataPage() {
  const [metadataList, setMetadataList] = useState([]);
  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(true);

  // Get any searched value
  const query = useQuery();
  const searchValue = query.get("search");

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    count: 0,
  });

  function handleChangeQuery(value) {
    setQueryParameter(value);
  }

  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let metadataListResult = [];
        let paginationResult;

        const APIConfig = {
          queryStringParameters: {
            ...queryParameter,
            search: searchValue,
          },
        };

        const responseMetadata = await API.get(
          "DataPortalApi",
          "/metadata",
          APIConfig
        );
        metadataListResult = responseMetadata.results;
        paginationResult = responseMetadata.pagination;

        // Do Not update state on unmount
        if (componentUnmount) return;

        setMetadataList(metadataListResult);
        setPagination(paginationResult);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured while fetching metadata. Please try again!",
        });
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [searchValue, queryParameter, setDialogInfo]);

  return (
    <>
      <Grid item container justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Metadata Page
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <WorkflowFilter>
          {isLoading ? (
            <LinearProgress />
          ) : (
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{ borderRadius: "10px", marginBottom: "20px" }}
            >
              <MetadataTable metadataList={metadataList} />
              <Pagination
                pagination={pagination}
                handleChangeQuery={handleChangeQuery}
              />
            </TableContainer>
          )}
        </WorkflowFilter>
      </Grid>
    </>
  );
}

export default MetadataPage;
