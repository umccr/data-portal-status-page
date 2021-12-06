import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";

// Custom Component
import StatusRow from "./StatusRow";

import {
  FIELD_TO_DISPLAY,
  convertToDisplayName,
  getWorkflowPipeline,
} from "../utils/Constants";

function StatusTable(props) {
  // The Status table is the table for each individual library run grouped by metadata type.
  // For example one status Table is the table of Tumor Normal type runs

  const { pipelineType, metadataGrouped, noTitle, title } = props;
  // 
  return (
    <TableContainer sx={{ textAlign: "left", margin: "1em 0 2em" }}>
      {noTitle ? (
        <></>
      ) : (
        <Typography
          sx={{ margin: "0 0 1em 0" }}
          variant="h6"
          gutterBottom
          component="div"
        >
          {title ? title : pipelineType}
        </Typography>
      )}

      <TableContainer
        sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}
      >
        <Table sx={{ tableLayout: "fixed" }} size="small" aria-label="MetaData">
          {/* Display Table Headers */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#CFD8DC" }}>
              {/* Display metadata Headers */}
              {FIELD_TO_DISPLAY.map((field_name, index) => (
                <TableCell
                  key={index}
                  sx={{ textAlign: "center", width: "100px" }}
                >
                  {convertToDisplayName(field_name)}
                </TableCell>
              ))}

              {/* Display Workflows header if any*/}

              {getWorkflowPipeline(pipelineType).map((field_name, index) => (
                <TableCell
                  key={index}
                  sx={{
                    textAlign: "center",
                    width: "100px",
                  }}
                >
                  {field_name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Display Body content */}
          <TableBody>
            {metadataGrouped[pipelineType].map((metadata, index) => (
              <StatusRow
                key={index}
                metadata={metadata}
                workflow_list={getWorkflowPipeline(pipelineType)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableContainer>
  );
}

export default StatusTable;
