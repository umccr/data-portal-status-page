import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useLocation } from "react-router-dom";

import { TableContainer, Paper, LinearProgress } from "@mui/material";

// Custom Components
import Pagination from "../utils/Pagination";
import StatusIndex from "../status/StatusIndex";
import { useDialogContext } from "../utils/DialogComponent";
import { useStatusToolbarContext } from "../status/StatusToolbar";
// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

async function getQueryMetadata(queryParameter) {
  let display_field_list = [];

  // Api Calls to LibraryRun to get list of Metadata
  const APIConfig = queryParameter;
  const responseLibraryRun = await API.get(
    "DataPortalApi",
    "/libraryrun/",
    APIConfig
  );

  const libraryRunList = responseLibraryRun.results;
  const paginationResult = responseLibraryRun.pagination;

  // For each libraryRun list, fetch metadata
  for (const libraryRun of libraryRunList) {
    const APIConfig = {
      queryStringParameters: {
        library_id: libraryRun.library_id,
      },
    };
    const responseMetadata = await API.get(
      "DataPortalApi",
      "/metadata",
      APIConfig
    );
    const metadata_result = responseMetadata.results[0];
    
    // Expected data to extract from metadata and libraryRun
    // {
    //   library_id: 
    //   sample_id:
    //   subject_id:
    //   workflow_id:
    // }

    const extract_data = {
      ...metadata_result,
      library_id: libraryRun.library_id,
      workflow_id: libraryRun.workflows
    }

    display_field_list = [...display_field_list, extract_data];
  }
  return { pagination: paginationResult, results: display_field_list };
}

function LibraryRunAction() {
  const [metadataList, setMetadataList] = useState([]);
  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(true);
  const { toolbarState } = useStatusToolbarContext();
  // Get any searched value
  const query = useQuery();
  const searchValue = query.get("search");

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({ rowsPerPage: 50 });
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 50,
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
        if (toolbarState.status.length > 0) {
          APIConfig = {
            ...queryParameter,
            end_status: toolbarState.status[0],
          };
        }
        const responseMetadata = await getQueryMetadata(APIConfig);
        metadataListResult = responseMetadata.results;
        paginationResult = responseMetadata.pagination;

        // Do Not update state on unmount
        if (componentUnmount) return;
        setMetadataList(metadataListResult);
        setPagination(paginationResult);
      } catch (err) {
        console.log(err);
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
  }, [searchValue, queryParameter, setDialogInfo, toolbarState]);
  return (
    <div>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{ borderRadius: "10px", marginBottom: "20px" }}
        >
          <StatusIndex metadataList={metadataList} />
          <Pagination
            pagination={pagination}
            handleChangeQuery={handleChangeQuery}
            paginationName="metadata"
          />
        </TableContainer>
      )}
    </div>
  );
}

export default LibraryRunAction;
