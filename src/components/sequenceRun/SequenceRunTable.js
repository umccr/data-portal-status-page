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
import { Typography } from "@mui/material";

// Custom Components
import ShowError from "../utils/ShowError";
import SequenceRunRow from "./SequenceRunRow";
import { useSearchQueryContext } from "../utils/ContextLib";
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

export default function LibraryTable() {
  const [sequenceRunList, setSequenceRunList] = useState([]);

  const { searchQueryState } = useSearchQueryContext();

  const [isLoading, setIsLoading] = useState(false);

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  // Fetch sequence run data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (searchQueryState.sequence) {
          setSequenceRunList(searchQueryState.sequence);
        } else {
          const responseSequence = await API.get("DataPortalApi", "/sequence");
          setSequenceRunList(responseSequence.results);
        }

        // TODO: Remove the following line 
        setSequenceRunList(mock_sequence_run)
      } catch (err) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [searchQueryState]);

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{ borderRadius: "10px" }}
    >
      <ShowError handleError={handleError} isError={isError} />
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
        {/* <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Table>
    </TableContainer>
  );
}
