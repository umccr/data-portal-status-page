import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";
import { useLocation } from "react-router-dom";

// Material UI Components
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Custom Components
import CustomTable from "../components/workflows/WorkflowTable";
import { useDialogContext } from "../components/utils/DialogComponent";

// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function WorkflowTable() {
  const [workflowList, setWorkflowList] = useState([]);

  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(true);

  // Get any searched value
  const query = useQuery();
  const searchValue = query.get("search");

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({
    rowsPerPage: 100,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 0,
    count: 0,
  });

  function handleChangeQuery(value) {
    setQueryParameter(value);
  }

  // Fetch workflow run data from API
  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let newWorkflowList = [];
        let paginationResult;

        let APIConfig = {
          queryStringParameters: {
            ...queryParameter,
          },
        };
        if (searchValue) {
          APIConfig = {
            queryStringParameters: {
              ...APIConfig,
              search: searchValue,
            },
          };
        }

        const workflowResponse = await API.get(
          "DataPortalApi",
          "/workflows",
          APIConfig
        );
        newWorkflowList = workflowResponse.results;
        paginationResult = workflowResponse.pagination;

        // Do Not update state on unmount
        if (componentUnmount) return;
        setWorkflowList(newWorkflowList);
        setPagination(paginationResult);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured while fetching workflows. Please try again!",
        });
      }
      setIsLoading(false);
    };
    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [setDialogInfo, queryParameter, searchValue]);
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography
          sx={{ display: "flex", justifyContent: "center" }}
          variant="h4"
        >
          Recent Workflows
        </Typography>
      </Grid>

      {isLoading ? (
        <CircularProgress sx={{ marginTop: "50px" }} />
      ) : (
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <CustomTable
              items={workflowList}
              paginationProps={pagination}
              handlePaginationPropsChange={handleChangeQuery}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
