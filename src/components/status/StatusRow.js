import React, { useState, useEffect } from "react";

// Aws amplify components
import { API } from "aws-amplify";

// mui components
import { styled } from "@mui/material/styles";
import { TableRow, TableCell, Link, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LinkIcon from "@mui/icons-material/Link";
import { grey } from "@mui/material/colors";

// Custom Component
import StatusPairing from "./StatusPairing";
import { FIELD_TO_DISPLAY } from "../utils/Constants";
import StatusChip from "./StatusChip";
import { useDialogContext } from "../utils/DialogComponent";

const DATA_PORTAL_CLIENT_DOMAIN =
  "data." + process.env.REACT_APP_UMCCR_DOMAIN_NAME;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: "60px",
  backgroundColor: "white",
  "&:nth-of-type(odd)": {
    backgroundColor: grey[100],
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function groupWorkflow(metadataCompletedWorkflow, workflow_list) {
  const groupedWorkflow = {};
  // Set Not Found by default
  for (const workflow of workflow_list) {
    groupedWorkflow[workflow] = "-";
  }

  for (const workflow of metadataCompletedWorkflow) {
    groupedWorkflow[workflow.type_name] = workflow.end_status;
  }

  return groupedWorkflow;
}

function StatusRow(props) {
  const { metadata, workflow_list, noLinkIcon } = props;
  const { setDialogInfo } = useDialogContext();
  // Set an empty placeholder for workflow status
  const [workflowStatus, setWorkflowStatus] = useState({});

  const [isTNPairingOpen, setIsTNPairingOpen] = useState(false);

  useEffect(() => {
    let componentUnmount = false;
    const fetchData = async () => {
      try {
        if (!metadata.completed_workflows) {
          const APIConfig = {
            queryStringParameters: {
              library_id: metadata.library_id,
            },
          };

          const responseWorkflow = await API.get(
            "DataPortalApi",
            "/workflows/",
            APIConfig
          );
          metadata["completed_workflows"] = responseWorkflow.results;
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
    <>
      <StyledTableRow>
        {FIELD_TO_DISPLAY.map((field_name, index) => (
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
              {field_name === "TUMOR_NORMAL" && !noLinkIcon ? (
                <>
                  {/* Div added to cover space needed in IconButton as it use absolute  */}
                  <div style={{ marginRight: "20px" }} />
                  <IconButton
                    sx={{ position: "absolute", right: "0" }}
                    aria-label="expand tumor normal row"
                    size="small"
                    onClick={() => setIsTNPairingOpen(!isTNPairingOpen)}
                  >
                    <LinkIcon color="disabled" />
                  </IconButton>
                </>
              ) : (
                <></>
              )}
            </div>
          </TableCell>
        ))}
      </StyledTableRow>
      {isTNPairingOpen ? (
        <StatusPairing
          library_id={metadata["library_id"]}
          isOpen={isTNPairingOpen}
          numSpan={FIELD_TO_DISPLAY.length + workflow_list.length}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default StatusRow;
