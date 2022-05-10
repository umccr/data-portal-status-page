import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";

// Custom Component
import StatusRow from "./StatusRow";
import TableColumnSelector from "../utils/TableColumnSelector";

import { convertToDisplayName, getWorkflowPipeline } from "../utils/Constants";

const COLUMN_DISPLAY = {
  library_id: true,
  subject_id: true,
  sample_id: true,
  assay: false,
  coverage: false,
  coverage_yield: false,
  experiment_id: false,
  external_sample_id: false,
  external_subject_id: false,
  instrument_run_id: false,
  lane: false,
  override_cycles: false,
  phenotype: true,
  project_name: false,
  project_owner: false,
  qc_pass: false,
  qc_status: false,
  quality: false,
  run_id: false,
  sample_name: false,
  source: false,
  truseqindex: false,
  type: false,
  valid_for_analysis: false,
  workflow: false,
};

function StatusTable(props) {
  // The Status table is the table for each individual library run grouped by metadata type.
  // For example one status Table is the table of Tumor Normal type runs

  const { pipelineType, metadataGrouped, noTitle, title } = props;

  // Column Selector
  const [columnSelectedObj, setColumnSelectedObj] = useState(COLUMN_DISPLAY);
  const columnOptions = Object.keys(COLUMN_DISPLAY);
  const columnSelectedArray = columnOptions.filter(
    (key) => columnSelectedObj[key]
  );

  console.log("columnSelectedArray", columnSelectedArray);
  const handleColumnOptionsChange = (item) => {
    setColumnSelectedObj(item);
  };

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
        <Table
          sx={{ tableLayout: "fixed", position: "relative" }}
          size="small"
          aria-label="MetaData"
        >
          <TableColumnSelector
            columnOptions={columnOptions}
            columnSelectedObj={columnSelectedObj}
            handleColumnSelector={handleColumnOptionsChange}
          />
          {/* Display Table Headers */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#CFD8DC" }}>
              {/* Display metadata Headers */}
              {columnSelectedArray.map((field_name, index) => (
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
                columnSelectedArray={columnSelectedArray}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </TableContainer>
  );
}

export default StatusTable;
