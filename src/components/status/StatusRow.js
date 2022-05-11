import React, { useState, useEffect } from "react";

// Aws amplify components
import { API } from "aws-amplify";

// mui components
import { styled } from "@mui/material/styles";
import { TableRow, TableCell, Link } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";

// Custom Component
import {
  WorkflowTypeEquivalence,
  createQueryParameterFromArray,
} from "../utils/Constants";
import StatusChip from "./StatusChip";
import { useDialogContext } from "../utils/DialogComponent";

const DATA_PORTAL_CLIENT_DOMAIN =
  "data." + process.env.REACT_APP_UMCCR_DOMAIN_NAME;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "white",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 1,
  },
}));

function groupWorkflow(metadataCompletedWorkflow, workflow_list) {
  const groupedWorkflowStatus = {};

  for (const workflow_display of workflow_list) {
    let workflowStatusResult = "-"; // '-' by default

    // Find from array
    for (const workflowObject of metadataCompletedWorkflow) {
      const workflow_type_name = workflowObject["type_name"];

      if (
        workflow_type_name === workflow_display ||
        workflow_type_name === WorkflowTypeEquivalence[workflow_display]
      ) {
        // Find status
        workflowStatusResult = workflowObject["end_status"];
      }
    }

    groupedWorkflowStatus[workflow_display] = workflowStatusResult;
  }

  return groupedWorkflowStatus;
}

function StatusRow(props) {
  const { metadata, workflow_list, columnSelectedArray } = props;
  const { setDialogInfo } = useDialogContext();
  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState({});

  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        if (!metadata.completed_workflows) {
          if (metadata.workflows.length > 0) {
            // Construct workflow query param string
            let queryPath = "/workflows/";

            // Add query to status toolbar to the query
            const parameterString = createQueryParameterFromArray(
              "id",
              metadata.workflows
            );
            queryPath = queryPath.concat("?", parameterString);

            const responseWorkflow = await API.get("DataPortalApi", queryPath);

            metadata["completed_workflows"] = responseWorkflow.results;
          } else {
            metadata["completed_workflows"] = [];
          }
        }

        const groupedWorkflow = groupWorkflow(
          metadata["completed_workflows"],
          workflow_list
        );

        if (componentUnmount) return;
        setWorkflowStatus(groupedWorkflow);
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent: "".concat(
            "Sorry, An error has occured when fetching metadata. Please try again!\n",
            "\nError:",
            err
          ),
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
    <>
      <StyledTableRow>
        {columnSelectedArray.map((field_name, index) => (
          <TableCell key={index} sx={{ textAlign: "center" }}>
            {field_name === "subject_id" ? (
              <Link
                underline="hover"
                color="black"
                href={
                  "https://" +
                  DATA_PORTAL_CLIENT_DOMAIN +
                  "/subjects/" +
                  metadata[field_name]
                }
              >
                {metadata[field_name]}
              </Link>
            ) : (
              metadata[field_name]
            )}
          </TableCell>
        ))}

        {workflow_list.map((field_name, index) => (
          <TableCell
            key={index}
            sx={{ textAlign: "center", position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {workflowStatus[field_name] ? (
                <StatusChip status={workflowStatus[field_name]} />
              ) : (
                <CircularProgress />
              )}
            </div>
          </TableCell>
        ))}
      </StyledTableRow>
    </>
  );
}

export default StatusRow;
