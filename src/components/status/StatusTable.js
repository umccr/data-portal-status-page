import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import { grey } from "@mui/material/colors";

// Custom Component
import StatusRow from "./StatusRow";
import TableColumnSelector from "../utils/TableColumnSelector";

import { convertToDisplayName, getWorkflowPipeline, STATUS_COLUMN_DISPLAY } from "../utils/Constants";
import { Paper } from "@mui/material";

// Custom hooks for local storage
import { useLocalStorage } from "../utils/LocalStorage";

function StatusTable(props) {
  // The Status table is the table for each individual library run grouped by metadata type.
  // For example one status Table is the table of Tumor Normal type runs

  const { pipelineType, metadataGrouped, noTitle, title } = props;

  // Column Selector
  const [columnSelectedObj, setColumnSelectedObj] = useLocalStorage('StatusColumnDisplay', STATUS_COLUMN_DISPLAY);
  const columnOptions = Object.keys(STATUS_COLUMN_DISPLAY);
  const columnSelectedArray = columnOptions.filter(
    (key) => columnSelectedObj[key]
  );

  // Sorting Table
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState();
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleColumnOptionsChange = (item) => {
    setColumnSelectedObj(item);
  };

  return (
    <TableContainer
      sx={{ textAlign: "center", margin: "1em 0 2em", position: "relative" }}
    >
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
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
        component={Paper}
        elevation={3}
      >
        <TableColumnSelector
          columnOptions={columnOptions}
          columnSelectedObj={columnSelectedObj}
          defaultColumnSelectedObj={STATUS_COLUMN_DISPLAY}
          handleColumnSelector={handleColumnOptionsChange}
        />
        <Table
          sx={{
            tableLayout: "fixed",
            border: 1,
            borderColor: grey[300],
            borderRadius: "5px",
          }}
          size="small"
          aria-label="MetaData"
        >
          {/* Display Table Headers */}
          <TableHead>
            <TableRow sx={{ backgroundColor: grey[200], height: "3.5rem" }}>
              {/* Display metadata Headers */}
              {columnSelectedArray.map((field_name, index) => (
                <TableCell
                  key={index}
                  sx={{ textAlign: "center", width: "100px", overflowWrap: "anywhere"}}
                >
                  <TableSortLabel
                    active={orderBy === field_name}
                    direction={orderBy === field_name ? order : "asc"}
                    onClick={() => handleRequestSort(field_name)}
                    sx={{
                      span: {
                        backgroundColor: "black",
                        position: "relative",
                      },
                      svg: {
                        right: "-1.5rem",
                        position: "absolute",
                      },
                    }}
                  >
                    {convertToDisplayName(field_name)}
                  </TableSortLabel>
                </TableCell>
              ))}

              {/* Display Workflows header if any*/}

              {getWorkflowPipeline(pipelineType).map((field_name, index) => (
                <TableCell
                  key={index}
                  sx={{
                    textAlign: "center",
                    width: "105px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {field_name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Display Body content */}
          <TableBody>
            {sortTableValues(metadataGrouped[pipelineType], order, orderBy).map(
              (metadata, index) => (
                <StatusRow
                  key={index}
                  metadata={metadata}
                  workflow_list={getWorkflowPipeline(pipelineType)}
                  columnSelectedArray={columnSelectedArray}
                />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableContainer>
  );
}

export default StatusTable;

function sortTableValues(dataList, order, orderBy) {
  if (!orderBy) {
    return dataList;
  } else {
    return dataList.sort((a, b) => {
      let result = 0;
      if (b[orderBy] < a[orderBy]) result = 1;
      if (b[orderBy] > a[orderBy]) result = -1;

      if (order === "desc") {
        result = result * -1;
      }
      return result;
    });
  }
}
