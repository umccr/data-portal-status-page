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
import Typography from "@mui/material/Typography";

import StatusChip from "../status/StatusChip";
import JSONTable from "../utils/JSONTable";
import TableColumnSelector from "../utils/TableColumnSelector";
import { toTitle } from "../utils/Util";

const COLUMN_DISPLAY = {
  wfr_name: true,
  wfr_id: true,
  type_name: true,
  end_status: true,
  start: false,
  end: true,
  id: false,
  sample_name: false,
  portal_run_id: false,
  wfl_id: false,
  wfv_id: false,
  version: false,
  input: false,
  output: false,
  notified: false,
  sequence_run: false,
  batch_run: false,
};

/**
 * Custom Main Table
 */
export default function CustomTable(props) {
  const { items, paginationProps, handleChangeQuery, ordering } = props;

  // Table Ordering
  const order = ordering.startsWith("-") ? "desc" : "asc";
  const orderBy = ordering.replace("-", "");
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    handleChangeQuery((prev) => ({
      ...prev,
      ...{ ordering: `${isAsc ? "-" : ""}${property}` },
    }));
  };

  // Column Selector
  const [columnSelectedObj, setColumnSelectedObj] = useState(COLUMN_DISPLAY);
  const columnOptions = Object.keys(COLUMN_DISPLAY);
  const columnSelectedArray = columnOptions.filter(
    (key) => columnSelectedObj[key]
  );
  const handleColumnOptionsChange = (item) => {
    setColumnSelectedObj(item);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        width: "100%",
        overflow: "hidden",
        marginBottom: "2rem",
        position: "relative",
      }}
    >
      <TableContainer component={Paper}>
        <TableColumnSelector
          columnOptions={columnOptions}
          columnSelectedObj={columnSelectedObj}
          handleColumnSelector={handleColumnOptionsChange}
        />
        <Table
          sx={{ minWidth: 700 }}
          size="small"
          aria-label="customized table"
        >
          <CustomTableHead
            columnKey={columnSelectedArray}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <CustomTableBody
            listItem={items}
            columnSelectedObj={columnSelectedArray}
            order={order}
            orderBy={orderBy}
          />
        </Table>
      </TableContainer>
      {paginationProps && handleChangeQuery ? (
        CustomPaginationTable(paginationProps, handleChangeQuery)
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
  const { columnKey, order, orderBy, onRequestSort } = props;

  function updateSortItem(displayName) {
    onRequestSort(displayName);
  }
  return (
    <TableHead sx={{ height: "60px" }}>
      <TableRow>
        {/* DETAILS information */}
        <TableCell>
          <Typography sx={{ fontWeight: 500 }}>Details</Typography>
        </TableCell>

        {columnKey.map((columnObject, index) => (
          <TableCell key={index}>
            <TableSortLabel
              active={orderBy === columnObject}
              direction={orderBy === columnObject ? order : "asc"}
              onClick={() => updateSortItem(columnObject)}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {toTitle(columnObject)}
              </Typography>
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

function TableCellData(props) {
  const { obj_item, curr_key } = props;
  if (curr_key === "end_status") {
    return <StatusChip status={obj_item[curr_key]} />;
  }

  // Converting time to be more readable
  if ((curr_key === "start") | (curr_key === "end")) {
    const date_utc = new Date(obj_item[curr_key]);
    return date_utc.toLocaleString("en-GB");
  }

  return obj_item[curr_key];
}

function CustomTableBody(props) {
  const { listItem, columnSelectedObj, order, orderBy } = props;

  return (
    <TableBody>
      {sortTableValues(listItem, order, orderBy).map((item, index) => (
        <TableRow key={index}>
          {/* DETAIL JSON BUTTON */}
          <TableCell>
            <DetailButton jsonData={item} />
          </TableCell>

          {columnSelectedObj.map((key, objIndex) => (
            <TableCell align="left" key={objIndex}>
              <TableCellData obj_item={item} curr_key={key} />
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
        rowsPerPageOptions={[50, 100, 200, 300]}
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
