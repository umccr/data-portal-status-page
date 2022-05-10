import React, { useState } from "react";

// MUI Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import StatusChip from "../status/StatusChip";
import JSONTable from "../utils/JSONTable";

const COLUMN_MAPPPING = [
  { displayName: "RunID", jsonKey: "wfr_name" },
  // { displayName: "Workflow ID", jsonKey: ["wfl_id"] },
  // { displayName: "Workflow Version", jsonKey: ["version"] },
  // { displayName: "Workflow Version Id", jsonKey: ["wfv_id"] },
  { displayName: "WorkflowType", jsonKey: "type_name" },
  { displayName: "Status", jsonKey: "end_status" },
  { displayName: "Start Time", jsonKey: "start" },
  { displayName: "End Time", jsonKey: "end" },
];

/**
 * Custom Main Table
 */
export default function CustomTable(props) {
  const { items, paginationProps, handlePaginationPropsChange } = props;

  // Table Ordering
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState();
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Paper
      elevation={5}
      sx={{ width: "100%", overflow: "hidden", marginBottom: "2rem" }}
    >
      <TableContainer component={Paper} sx={{ position: "relative" }}>


        <Table
          sx={{ minWidth: 700 }}
          size="small"
          aria-label="customized table"
        >
          <CustomTableHead
            columnMapping={COLUMN_MAPPPING}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <CustomTableBody
            listItem={items}
            columnMapping={COLUMN_MAPPPING}
            order={order}
            orderBy={orderBy}
          />
        </Table>
      </TableContainer>
      {paginationProps && handlePaginationPropsChange ? (
        CustomPaginationTable(paginationProps, handlePaginationPropsChange)
      ) : (
        <></>
      )}
    </Paper>
  );
}

/**
 * Table Body
 */

function CustomTableHead(props) {
  const { columnMapping, order, orderBy, onRequestSort } = props;

  function updateSortItem(displayName) {
    onRequestSort(displayName);
  }
  return (
    <TableHead sx={{ height: "60px" }}>
      <TableRow>
        {/* DETAILS information */}
        <TableCell>Details</TableCell>

        {columnMapping.map((columnObject, index) => (
          <TableCell key={index}>
            <TableSortLabel
              active={orderBy === columnObject.jsonKey}
              direction={orderBy === columnObject.jsonKey ? order : "asc"}
              onClick={() => updateSortItem(columnObject.jsonKey)}
            >
              {columnObject.displayName}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/**
 * Table Body
 */
function DetailButton(props) {
  const { jsonData } = props;

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const handleSetIsOpen = (value) => {
    setIsDetailOpen(value);
  };

  return (
    <>
      <IconButton onClick={() => setIsDetailOpen(true)}>
        <InfoIcon />
      </IconButton>
      <JSONTable
        jsonData={jsonData}
        isOpen={isDetailOpen}
        handleSetIsOpen={handleSetIsOpen}
      />
    </>
  );
}

function CustomTableBody(props) {
  const { listItem, columnMapping, order, orderBy } = props;

  return (
    <TableBody>
      {sortTableValues(listItem, order, orderBy).map((item, index) => (
        <TableRow key={index}>
          {/* DETAIL JSON BUTTON */}
          <TableCell>
            <DetailButton jsonData={item} />
          </TableCell>

          {columnMapping.map((displayObj, objIndex) => (
            <TableCell align="left" key={objIndex}>
              {displayObj.jsonKey !== "end_status" ? (
                item[displayObj.jsonKey]
              ) : (
                <StatusChip status={item[displayObj.jsonKey]} />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

/**
 * Pagination Table
 */

function CustomPaginationTable(props, handlePaginationPropsChange) {
  const handleChangeRowsPerPage = (event) => {
    handlePaginationPropsChange((prevState) => {
      return {
        ...prevState,
        page: 0 + 1, // Pagination starts at 1
        rowsPerPage: parseInt(event.target.value, 10),
      };
    });
  };

  const handleChangePage = (event, newPage) => {
    handlePaginationPropsChange((prevState) => {
      return {
        ...prevState,
        page: newPage + 1,
      };
    });
  };

  return (
    <TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100, 300]}
        component="div"
        count={props.count}
        rowsPerPage={props.rowsPerPage}
        page={props.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

/**
 * Helper Function
 */

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

export function getTotalItemCountFromRes(dataRes) {
  const totalRecord = dataRes.totalItemCount
    ? dataRes.totalItemCount
    : dataRes.items.length;

  return totalRecord;
}
