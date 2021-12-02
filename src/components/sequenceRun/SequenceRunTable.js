import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";
import { useLocation } from "react-router-dom";

// Material UI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// Custom Components
import SequenceRunRow from "./SequenceRunRow";
import Pagination from "../utils/Pagination";
import { useDialogContext } from "../utils/DialogComponent";


async function isBclConvertRun(instrument_run_id){
  let isBclConvert = false;

  // Check for BCL_CONVERT
  let APIConfig = {
    queryStringParameters: {
      type_name:"BCL_CONVERT",
      sequence_run__instrument_run_id:instrument_run_id
    }
  };
  const responseBCLConvertQuery = await API.get(
    "DataPortalApi",
    "/workflows/",
    APIConfig
  );

  if (responseBCLConvertQuery.pagination.count > 0){
    isBclConvert = true
  }

  return isBclConvert
}

function displaySequenceRow(sequenceList) {
  if (sequenceList.length > 1) {
    return sequenceList.map((row, index) => (
      <SequenceRunRow key={index} data={row} />
    ));
  } else {
    return (
      <TableRow>
        <TableCell>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", padding: "50px" }}
          >
            Sorry! No Sequence Data Found
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}
// A custom hook that builds on useLocation to parse
// the query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function SequenceRunTable() {
  const [sequenceRunList, setSequenceRunList] = useState([]);

  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch sequence run data from API
  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let newSequenceList = [];
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

        const sequenceResponse = await API.get(
          "DataPortalApi",
          "/sequence",
          APIConfig
        );
        newSequenceList = sequenceResponse.results;
        paginationResult = sequenceResponse.pagination;
        
        // Looping for BCL_CONVERT
        for (const eachSequence of newSequenceList){
          eachSequence.isBclConvert = await isBclConvertRun(newSequenceList.instrument_run_id)
        }
          
        // Do Not update state on unmount
        if (componentUnmount) return;
        setSequenceRunList(newSequenceList);
        setPagination(paginationResult);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured while fetching sequences. Please try again!",
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
    <>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        <Table aria-label="Sequence Run Table" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            {/* Heading for table */}
            {/* <TableRow sx={{borderBottom: "1px solid"}}>
            <Typography variant="h6" sx={{padding:"1rem", paddingLeft:"2rem"}}>Sequence Run</Typography>
          </TableRow> */}
          </TableHead>
          <TableBody aria-label="Sequence Run Table Body">
            {isLoading ? (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              displaySequenceRow(sequenceRunList)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        pagination={pagination}
        handleChangeQuery={handleChangeQuery}
        paginationName="sequence"
      />
    </>
  );
}
