import React, { useState, useEffect } from "react";

import { groupBy, sortBy } from "lodash";

// Aws amplify components
import { API } from "aws-amplify";

// mui components
import { styled } from "@mui/material/styles";
import { TableRow, TableCell, Link, Typography, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// Custom Component
import {
  WorkflowTypeEquivalence,
  createQueryParameterFromArray,
} from "../utils/Constants";
import StatusChip from "./StatusChip";
import { useDialogContext } from "../utils/DialogComponent";

// Remove `prod` from Domain Name
const domain_name = process.env.REACT_APP_UMCCR_DOMAIN_NAME.replace(
  "prod.",
  ""
);
const DATA_PORTAL_CLIENT_DOMAIN = "data." + domain_name;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "white",
  height: "3rem",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 1,
  },
}));

function groupWorkflow(metadataCompletedWorkflow, workflow_list) {
  const groupedWorkflowStatus = {};

  for (const workflow_display of workflow_list) {
    let workflowStatusResult = "-"; // '-' by default

    // Group all workflows result to a dict
    const groupWorkflowType = groupBy(
      metadataCompletedWorkflow,
      (workflowObject) => {
        return workflowObject["type_name"];
      }
    );

    for (const key in groupWorkflowType) {
      // Find matching workflow for the display
      if (
        key === workflow_display ||
        key === WorkflowTypeEquivalence[workflow_display]
      ) {
        // Sort in case of multiple workflow runs to pick
        // the latest end (timestsamp)
        const workflowData = sortBy(
          groupWorkflowType[key],
          (o) => o.end
        ).reverse();

        // Since the sort is reverse
        // The latest one must be the first index
        workflowStatusResult = workflowData[0]["end_status"];
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
                <Typography>{`${metadata[field_name]}`}</Typography>
              </Link>
            ) : (
              <Typography>{`${metadata[field_name]}`}</Typography>
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
                <Box>
                  <CircularProgress size="1.75rem" />
                </Box>
              )}
            </div>
          </TableCell>
        ))}
      </StyledTableRow>
    </>
  );
}

export default StatusRow;
