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
import { useDialogContext } from "../higherOrderComponent/DialogComponent";
import SequenceRunChip from "./SequenceRunChip";
import MetadataTable from "../metadata/MetadataTable";
import Pagination from "../utils/Pagination";

import { mock_metadata } from "../utils/Constants";

async function getMetadataFromInstrumentRunId(
  instrument_run_id,
  queryParameter
) {
  let metadataList = [];

  // Api Calls to LibraryRun to get list of Metadata
  const APIConfig = {
    queryStringParameters: {
      ...queryParameter,
      instrument_run_id: instrument_run_id,
    },
  };
  const responseLibraryRun = await API.get(
    "DataPortalApi",
    "/libraryrun",
    APIConfig
  );
  const libraryRunList = responseLibraryRun.results;
  const paginationRessuslt = responseLibraryRun.pagination;

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
  return { pagination: paginationRessuslt, results: metadataList };
}

// Convert time to Locale
function getDateTimeString(iso_string) {
  let dateTime = new Date(iso_string);
  return dateTime.toLocaleString("en-GB");
}

function SequenceRunRow(props) {
  const { data } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { setDialogInfo } = useDialogContext();

  const [isLoading, setIsLoading] = useState(false);
  const [metadataList, setMetadataList] = useState([]);

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

  // Use Effect is row is expand to fetch metadata List
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const metadataResponse = await getMetadataFromInstrumentRunId(
          data.instrument_run_id,
          queryParameter
        );
        setPagination(metadataResponse.pagination);
        setMetadataList(metadataResponse.results);
        // TODO: Remove the following setMock Data
        setMetadataList(mock_metadata);
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
  }, [isOpen, data.instrument_run_id, queryParameter, setDialogInfo]);

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
              spacing={0}
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
                  <Typography display="inline" sx={{ fontWeight: "bold" }}>
                    Sequence Run:{" "}
                  </Typography>
                  <Typography display="inline" sx={{ fontWeight: "medium" }}>
                    {data.instrument_run_id}
                  </Typography>
                </Grid>
                <Grid item>
                  <SequenceRunChip status={data.status} />
                </Grid>
              </Grid>

              {/* Row for row_id and date_modified */}
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {/* Place Holder for Number of Workflow has completed */}

                {/* <Grid item>
                <Typography display="inline" sx={{ fontWeight: "regular" }}>
                  run_id:{" "}
                </Typography>
                <Typography display="inline" sx={{ fontWeight: "light" }}>
                  {row.instrument_run_id}
                </Typography>
              </Grid> */}
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    sx={{ fontWeight: "light" }}
                  >
                    date_modified:{" "}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    sx={{ fontWeight: "light" }}
                  >
                    {getDateTimeString(data.date_modified)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            backgroundColor: grey[50],
            paddingBottom: 0,
            paddingTop: 0,
            textAlign: "center",
          }}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {isLoading ? (
              <CircularProgress sx={{ padding: "20px" }} />
            ) : (
              <>
                <MetadataTable
                  instrument_run_id={data.instrument_run_id}
                  metadataList={metadataList}
                />
                <Pagination
                  pagination={pagination}
                  handleChangeQuery={handleChangeQuery}
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
