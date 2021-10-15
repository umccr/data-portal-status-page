import React, { useState, useEffect } from "react";

import { API } from "aws-amplify";

import { styled } from "@mui/material/styles";
import { TableRow, TableCell } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { FIELD_TO_DISPLAY } from "../utils/Constants";
import WorkflowChip from "./WorkflowChip";
import ShowError from "../utils/ShowError";

import { useSearchContext } from "../higherOrderComponent/SearchQuery";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
    groupedWorkflow[workflow] = "NOT FOUND";
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
    groupedWorkflow[workflow.type_name] = workflow;
  }
  return groupedWorkflow;
}

function MetadataRow(props) {

  const { metadata, workflow_list } = props;
  const { queryResult } = useSearchContext();

  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState({});

  // State for error
  const [isError, setIsError] = useState(false);
  function handleError(value) {
    setIsError(value);
  }

  useEffect(() => {
    console.log("how many times printed?")
    const fetchData = async () => {
      try {
        if (queryResult) {
          setWorkflowStatus(queryResult);
        } else {
          // Construct on API config including params
          const groupedWorkflow = await getWorkflow(metadata, workflow_list);
          setWorkflowStatus(groupedWorkflow);
        }

      } catch (err) {
        console.log(err);
        setIsError(true);
      }
    };
    fetchData();
  }, [metadata, workflow_list, queryResult]);

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
