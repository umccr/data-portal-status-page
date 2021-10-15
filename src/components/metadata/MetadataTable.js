import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

// MaterialUI component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

// Custom Component
import MetadataRow from "./MetadataRow";
import { useSearchQueryContext } from "../utils/ContextLib";
import ShowError from "../utils/ShowError";

import {
  WORKFLOW_PIPELINE,
  FIELD_TO_DISPLAY,
  CONVERT_TO_DISPLAY_NAME,
  SUPPORTED_PIPELINE,
} from "../utils/Constants";

import { mock_metadata } from "../utils/Constants";
import { TableContainer } from "@mui/material";

async function getMetadataFromInstrumentRunId(instrument_run_id) {
  let metadataGrouped = {};

  // Api Calls to LibraryRun to get list of Metadata
  const APIConfig = {
    queryStringParameters: {
      instrument_run_id: instrument_run_id,
    },
  };
  const responseLibraryRun = await API.get(
    "DataPortalApi",
    "/libraryrun",
    APIConfig
  );
  const libraryRunList = responseLibraryRun.results;

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
    const metadata_result_type = metadata_result.type;

    metadataGrouped[metadata_result_type] = [
      ...metadataGrouped[metadata_result_type],
      metadata_result,
    ];
  }
  return metadataGrouped;
}

function MetadataTable(props) {
  // Load data from context
  const { searchQueryState } = useSearchQueryContext();

  // Props for data ID
  const { instrument_run_id } = props;

  // Loading and error usecase
  const [isLoading, setIsLoading] = useState(false);

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  // Data
  const [metadataGrouped, setMetadataGrouped] = useState({});
  const [pipelineToDisplay, setPipelineToDisplay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (searchQueryState.metadata) {
          setMetadataGrouped(searchQueryState.metadata);
        } else {
          // Api Calls to get metadata List
          const metadataResponseList = await getMetadataFromInstrumentRunId(
            instrument_run_id
          );
          setMetadataGrouped(metadataResponseList);
        }
        setMetadataGrouped(mock_metadata);
      } catch (err) {
        console.log(err);
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [instrument_run_id, searchQueryState]);

  useEffect(() => {
    if (Object.keys(metadataGrouped).length !== 0) {
      setPipelineToDisplay(
        SUPPORTED_PIPELINE.filter(
          (each_type) => metadataGrouped[each_type].length > 0
        )
      );
    }
  }, [metadataGrouped]);

  return (
    <>
      {isLoading ? (
        <CircularProgress sx={{ padding: "20px" }} />
      ) : (
        <Container sx={{ padding: "20px 20px" }}>
          <ShowError handleError={handleError} isError={isError} />
          {pipelineToDisplay.map((pipeline_type, index) => (
            <TableContainer key={index} sx={{ textAlign: "left" }}>
              <Typography variant="h6" gutterBottom component="div">
                {pipeline_type}
              </Typography>

              <TableContainer
                sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}
              >
                <Table
                  sx={{ tableLayout: "fixed" }}
                  size="small"
                  aria-label="MetaData"
                >
                  {/* Display Table Headers */}
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#CFD8DC" }}>
                      {/* Display metadata Headers */}
                      {FIELD_TO_DISPLAY.map((field_name, index) => (
                        <TableCell
                          key={index}
                          sx={{ textAlign: "center", width: "100px" }}
                        >
                          {CONVERT_TO_DISPLAY_NAME[field_name]}
                        </TableCell>
                      ))}

                      {/* Display Workflows header */}
                      {WORKFLOW_PIPELINE[pipeline_type].map(
                        (field_name, index) => (
                          <TableCell
                            key={index}
                            sx={{ textAlign: "center", width: "100px" }}
                          >
                            {field_name}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>

                  {/* Display Body content */}
                  <TableBody>
                    {metadataGrouped[pipeline_type].map((metadata, index) => (
                      <MetadataRow
                        key={index}
                        metadata={metadata}
                        workflow_list={WORKFLOW_PIPELINE[pipeline_type]}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TableContainer>
          ))}
        </Container>
      )}
    </>
  );
}

export default MetadataTable;
