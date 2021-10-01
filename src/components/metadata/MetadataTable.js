import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import MetadataRow from "./MetadataRow";

import {
  WORKFLOW_PIPELINE,
  FIELD_TO_DISPLAY,
  CONVERT_TO_DISPLAY_NAME,
} from "../utils/Constants";


import { mock_metadata } from "../utils/Constants";
import { TableContainer } from "@mui/material";

function MetadataTable() {
  // Supported Workflow Types
  const SUPPORTED_PIPELINE = Object.keys(WORKFLOW_PIPELINE);

  const sorted_data = {
    WGS: [],
    WTS: [],
    ctTSO: [],
  };

  // Group data based on type
  for (const each_data of mock_metadata) {
    sorted_data[each_data.type].push(each_data);
  }
  // List of workflow to display
  const list_of_pipeline_to_display = SUPPORTED_PIPELINE.filter(
    (each_type) => sorted_data[each_type].length > 0
  );

  return (
    <>
      {list_of_pipeline_to_display.map((pipeline_type, index) => (
        <TableContainer key={index}>
          <Typography variant="h6" gutterBottom component="div">
            {pipeline_type}
          </Typography>

          <TableContainer
            sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}
          >
            <Table
              sx={{ tableLayout: "fixed" }}
              size="small"
              aria-label="MetaData"
            >
              {/* Display Table Headers */}
              <TableHead>
                <TableRow sx={{ backgroundColor: "#CFD8DC" }}>
                  {/* Display metadata Headers */}
                  {FIELD_TO_DISPLAY.map((field_name, index) => (
                    <TableCell
                      key={index}
                      sx={{ textAlign: "center", width: "100px" }}
                    >
                      {CONVERT_TO_DISPLAY_NAME[field_name]}
                    </TableCell>
                  ))}

                  {/* Display Workflows header */}
                  {WORKFLOW_PIPELINE[pipeline_type].map((field_name, index) => (
                    <TableCell
                      key={index}
                      sx={{ textAlign: "center", width: "100px" }}
                    >
                      {field_name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Display Metadata Header */}
              <TableBody>
                {sorted_data[pipeline_type].map((metadata, index) => (
                  <MetadataRow
                    key={index}
                    metadata={metadata}
                    workflow_list={WORKFLOW_PIPELINE[pipeline_type]}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TableContainer>
      ))}
    </>
  );
}

export default MetadataTable;
