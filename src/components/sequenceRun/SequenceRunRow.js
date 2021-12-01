import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

// Material-UI component
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";

// Custom Component
import { useDialogContext } from "../utils/DialogComponent";
import SequenceRunChip from "./SequenceRunChip";
import StatusIndex from "../status/StatusIndex";
import Pagination from "../utils/Pagination";
import { useStatusToolbarContext } from "../status/StatusToolbar";
import { convertToDisplayName, getDateTimeString } from "../utils/Constants";

function displayWithTypography(key, data, typograhyStyle) {
  "Display object with field in typography";
  return (
    <Typography variant="subtitle2" display="inline" sx={typograhyStyle}>
      {convertToDisplayName(key)}: {data}
    </Typography>
  );
}

async function getMetadataFromInstrumentRunId(
  instrument_run_id,
  queryParameter
) {
  let metadataList = [];
  let isBclConvert = false;

  // Api Calls to LibraryRun to get list of Metadata
  const APIConfig = {
    queryStringParameters: {
      ...queryParameter,
      instrument_run_id: instrument_run_id,
    },
  };
  const responseLibraryRun = await API.get(
    "DataPortalApi",
    "/libraryrun/",
    APIConfig
  );
  const libraryRunList = responseLibraryRun.results;
  const paginationResult = responseLibraryRun.pagination;

  // For each libraryRun list, fetch metadata
  for (const libraryRun of libraryRunList) {
    // BCL Convert
    if (libraryRun.workflows.length > 0) {
      isBclConvert = true;
    }

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

    metadataList = [...metadataList, metadata_result];
  }
  return {
    pagination: paginationResult,
    results: metadataList,
    isBclConvert: isBclConvert,
  };
}

function SequenceRunRow(props) {
  const { data } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { setDialogInfo } = useDialogContext();

  const [isLoading, setIsLoading] = useState(false);
  const [metadataList, setMetadataList] = useState([]);
  const { toolbarState } = useStatusToolbarContext();
  const statusArray = toolbarState.status;
  const [isBclConvert, setIsBclConvert] = useState(false);
  // PAGINATION
  const [queryParameter, setQueryParameter] = useState({
    rowsPerPage: 50,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
    count: 0,
  });
  function handleChangeQuery(value) {
    setQueryParameter(value);
  }

  // Use Effect is row is expand to fetch metadata List
  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        if (statusArray.length > 0) {
          queryParameter["end_status"] = statusArray[0];
        }
        setIsLoading(true);
        const metadataResponse = await getMetadataFromInstrumentRunId(
          data.instrument_run_id,
          queryParameter
        );

        if (componentUnmount) return;
        setPagination(metadataResponse.pagination);
        setMetadataList(metadataResponse.results);
        setIsBclConvert(metadataResponse.isBclConvert);
        setIsLoading(false);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured while fetching metadata. Please try again!",
        });
      }
    };
    if (isOpen) {
      fetchData();
    }
    return () => {
      componentUnmount = true;
    };
  }, [
    isOpen,
    data.instrument_run_id,
    queryParameter,
    setDialogInfo,
    statusArray,
  ]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: "100%" }}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            paddingTop="10px"
            paddingBottom="10px"
            paddingRight="10px"
          >
            <Grid
              item
              container
              xs={1}
              justifyContent="center"
              alignItems="center"
            >
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Grid>

            <Grid
              item
              xs={11}
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={1}
              padding={0.5}
            >
              {/* Row for sequence run Name and status */}
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  {displayWithTypography(
                    "instrument_run_id",
                    data.instrument_run_id,
                    {
                      fontWeight: "bold",
                    }
                  )}
                </Grid>
                <Grid item>
                  <SequenceRunChip label="Sequencing" status={data.status} />
                </Grid>
              </Grid>

              {/* Row for row_id and end_time */}
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {/* Place Holder for Number of Workflow has completed */}

                {/* <Grid item>
                {displayWithTypography(data, "number",{ fontWeight: "light" })}
                </Grid> */}
                <Grid item>
                  {data.end_time // Display end_time if exist otherwise start_time is displayed
                    ? displayWithTypography(
                        "end_time",
                        getDateTimeString(data.end_time),
                        {
                          fontWeight: "light",
                        }
                      )
                    : displayWithTypography(
                        "start_time",
                        getDateTimeString(data.start_time),
                        {
                          fontWeight: "light",
                        }
                      )}
                </Grid>
                {isOpen ? (
                  <Grid item>
                    <SequenceRunChip
                      label="BCL Convert"
                      status={isBclConvert ? "succeeded" : ""}
                    />
                  </Grid>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            backgroundColor: grey[50],
            padding: 0,
            textAlign: "center",
          }}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {isLoading ? (
              <div style={{ padding: "20px" }}>
                <CircularProgress aria-label="circular-loader" />
              </div>
            ) : (
              <>
                <StatusIndex
                  instrument_run_id={data.instrument_run_id}
                  metadataList={metadataList}
                />
                <Pagination
                  pagination={pagination}
                  handleChangeQuery={handleChangeQuery}
                  paginationName="Library Run"
                />
              </>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default SequenceRunRow;
