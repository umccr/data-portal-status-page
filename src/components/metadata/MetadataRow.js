import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

import { styled } from "@mui/material/styles";
import { TableRow, TableCell } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { FIELD_TO_DISPLAY } from "../utils/Constants";
import WorkflowChip from "./WorkflowChip";

import { useDialogContext } from "../utils/DialogComponent";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: "60px",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

async function getWorkflow(metadata, workflow_list) {
  const groupedWorkflow = {};
  // Set Not Found by default
  for (const workflow of workflow_list) {
    groupedWorkflow[workflow] = "-";
  }

  const APIConfig = {
    queryStringParameters: {
      library_id: metadata.library_id,
    },
  };

  const responseWorkflow = await API.get(
    "DataPortalApi",
    "/workflows/by_library_id/",
    APIConfig
  );

  // Assumption each library_id have only one workflow
  const workflowResults = responseWorkflow.results;
  for (const workflow of workflowResults) {
    groupedWorkflow[workflow.type_name] = workflow.end_status;
  }

  return groupedWorkflow;
}

function MetadataRow(props) {
  const { metadata, workflow_list } = props;
  const { setDialogInfo } = useDialogContext();

  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState({});

  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        // Construct on API config including params
        const groupedWorkflow = await getWorkflow(metadata, workflow_list);
        if (componentUnmount) return;
        setWorkflowStatus(groupedWorkflow);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured when fetching metadata. Please try again!",
        });
      }
    };
    if (workflow_list) {
      fetchData();
    }

    return () => {
      componentUnmount = true;
    };
  }, [metadata, workflow_list, setDialogInfo]);

  return (
    <StyledTableRow>
      {/* <ShowError handleError={handleError} isError={isError} /> */}
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
