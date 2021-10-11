import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

import { styled } from "@mui/material/styles";
import { TableRow, TableCell } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { CONVERT_TO_DISPLAY_NAME, FIELD_TO_DISPLAY } from "../utils/Constants";
import WorkflowChip from "./WorkflowChip";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function MetadataRow(props) {
  const { metadata, workflow_list } = props;

  const [isError, setIsError] = useState(false);

  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct on API config including params
        // const APIConfig = {
        //   queryStringParameters: {
        //     libraryId: "L2000",
        //   },
        // };
        // // TODO: Do the api call
        // const responseSequence = await API.get(
        //   "DataPortalApi",
        //   "/workflow",
        //   APIConfig
        // );
        setWorkflowStatus({
          BCL_CONVERT: "Succeeded",
          WTS: "Failed",
          DRAGEN_TSO_CTDNA: "Started",
        });
      } catch (err) {
        console.log(err);
        setIsError(true);
      }
    };
    fetchData();
  }, []);

  return (
    <StyledTableRow>
      {FIELD_TO_DISPLAY.map((field_name, index) => (
        <TableCell key={index} sx={{ textAlign: "center" }}>
          {metadata[field_name]}
        </TableCell>
      ))}

      {workflow_list.map((field_name, index) => (
        <TableCell key={index} sx={{ textAlign: "center" }}>
          {workflowStatus[field_name] ? (
            <WorkflowChip status={workflowStatus[field_name]} />
          ) : (
            <CircularProgress />
          )}
        </TableCell>
      ))}
    </StyledTableRow>
  );
}

export default MetadataRow;
