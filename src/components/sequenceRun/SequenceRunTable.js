import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";

import ShowError from "../utils/ShowError";
import SequenceRunRow from "./SequenceRunRow";
import { mock_sequence_run } from "../utils/Constants";

export default function LibraryTable() {
  const [sequenceRunList, setSequenceRunList] = useState([]);

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  // Fetch sequence run data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // You can await here
        const responseListSequenceRunId = await API.get(
          "DataPortalApi",
          "/runs"
        );
        for (const eachSequenceRunId of responseListSequenceRunId.results) {
          const headers = {
            queryStringParameters: {
              search: eachSequenceRunId,
            },
          };
          const responseSequenceRun = await API.get(
            "DataPortalApi",
            "/sequence",
            headers
          );
          // Grab the latest sequence event
          setSequenceRunList((prevState) => [
            ...prevState,
            responseSequenceRun.results[3],
          ]);
        }
      } catch (err) {
        console.log(err);
        setIsError(true);
      }
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
          {mock_sequence_run.map((row, index) => (
            <SequenceRunRow key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
