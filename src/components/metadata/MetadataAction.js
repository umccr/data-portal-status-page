import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useLocation } from "react-router-dom";

import { TableContainer, Paper, LinearProgress } from "@mui/material";

// Custom Components
import Pagination from "../utils/Pagination";
import MetadataTable from "./MetadataTable";
import { useDialogContext } from "../utils/DialogComponent";
import { useMetadataToolbarContext } from "./MetadataToolbar";
// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

async function getQueryMetadata(queryParameter) {
  let metadataList = [];

  // Api Calls to LibraryRun to get list of Metadata
  const APIConfig = {
    queryStringParameters: {
      ...queryParameter,
    },
  };
  const responseLibraryRun = await API.get(
    "DataPortalApi",
    "/libraryrun/by_workflow",
    APIConfig
  );

  const libraryRunList = responseLibraryRun.results;
  const paginationResult = responseLibraryRun.pagination;

  // For each libraryRun list, fetch metadata
  for (const libraryRun of libraryRunList) {
    const APIConfig = {
      queryStringParameters: {
        library: libraryRun.library_id,
      },
    };
    const responseMetadata = await API.get(
      "DataPortalApi",
      "/metadata",
      APIConfig
    );
    const metadata_result = responseMetadata.results[0];

    metadataList = [...metadataList, metadata_result];
  }
  return { pagination: paginationResult, results: metadataList };
}
function MetadataAction() {
  const [metadataList, setMetadataList] = useState([]);
  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(true);
  const { toolbarState } = useMetadataToolbarContext();
  // Get any searched value
  const query = useQuery();
  const searchValue = query.get("search");

  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({ rowsPerPage: 50 });
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
        if (toolbarState.status.length === 1) {
          const APIConfig = {
            ...queryParameter,
            end_status: toolbarState.status[0],
          };
          const responseMetadata = await getQueryMetadata(APIConfig);
          metadataListResult = responseMetadata.results;
          paginationResult = responseMetadata.pagination;
        } else {
          const responseMetadata = await API.get(
            "DataPortalApi",
            "/metadata",
            APIConfig
          );
          metadataListResult = responseMetadata.results;
          paginationResult = responseMetadata.pagination;
        }
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
      {" "}
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
            paginationName="metadata"
          />
        </TableContainer>
      )}
    </div>
  );
}

export default MetadataAction;
