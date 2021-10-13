import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

import ShowError from "../utils/ShowError";
import SequenceRunRow from "./SequenceRunRow";
import { mock_sequence_run } from "../utils/Constants";
import { useSearchQueryContext } from "../utils/ContextLib";

export default function LibraryTable() {
  const [sequenceRunList, setSequenceRunList] = useState([]);
  const { searchQueryState, setSearchQueryState } = useSearchQueryContext();

  const [isLoading, setIsLoading] = useState(false);

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  // Fetch sequence run data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const responseSequence = await API.get("DataPortalApi", "/sequence");
        // Grab the latest sequence event
        setSequenceRunList(responseSequence.results);
      } catch (err) {
        console.log(err);
        setIsError(true);
      }
      setIsLoading(false)
    };
    fetchData();
  }, []);

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
              <TableCell sx={{textAlign:"center"}}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            mock_sequence_run.map((row, index) => (
              <SequenceRunRow key={index} data={row} />
            ))
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
