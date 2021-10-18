import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

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
import { useSearchContext } from "../higherOrderComponent/SearchContextProvider";
import { useDialogContext } from "../higherOrderComponent/DialogComponent";

import { mock_sequence_run } from "../utils/Constants";

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

export default function SequenceRunTable() {
  const [sequenceRunList, setSequenceRunList] = useState([]);

  const { queryResult } = useSearchContext();
  const { setDialogInfo } = useDialogContext();
  const [isLoading, setIsLoading] = useState(false);

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
        if (queryResult.sequenceSearch) {
          newSequenceList = queryResult.sequenceSearch.results;
          paginationResult = queryResult.sequenceSearch.pagination;
        } else {
          const APIConfig = {
            queryStringParameters: {
              ...queryParameter,
            },
          };
          const sequenceResponse = await API.get(
            "DataPortalApi",
            "/sequence",
            APIConfig
          );
          newSequenceList = sequenceResponse.results;
          paginationResult = sequenceResponse.pagination;
        }

        // Do Not update state on unmount
        if (componentUnmount) return;

        // setPagination(paginationResult);
        setSequenceRunList(newSequenceList);
        // TODO: Remove the following line (It uses mock data)
        setSequenceRunList(mock_sequence_run);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: "Sorry, An error has occured. Please try again!",
        });
      }
      setIsLoading(false);
    };
    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [queryResult, setDialogInfo, queryParameter]);

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
      />
    </>
  );
}
