import { useState } from 'react';

// MUI Components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';

import StatusChip from '../status/StatusChip';
import JSONTable from '../../utils/JSONTable';
import TableColumnSelector from '../../utils/TableColumnSelector';
import { toTitle } from '../../utils/Util';
import { WORKFLOW_COLUMN_DISPLAY } from '../../utils/Constants';
import { useLocalStorage } from '../../utils/LocalStorage';

/**
 * Custom Main Table
 */
export default function CustomTable(props: any) {
  const { items, paginationProps, handleChangeQuery, ordering } = props;

  // Table Ordering
  const order = ordering.startsWith('-') ? 'desc' : 'asc';
  const orderBy = ordering.replace('-', '');
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    handleChangeQuery((prev: any) => ({
      ...prev,
      ...{ ordering: `${isAsc ? '-' : ''}${property}` },
    }));
  };

  // Column Selector
  // repeat code in the status table
  const [columnSelectedObj, setColumnSelectedObj] = useLocalStorage(
    'WorkflowColumnDisplay',
    WORKFLOW_COLUMN_DISPLAY
  );
  const columnOptions = Object.keys(WORKFLOW_COLUMN_DISPLAY);
  const columnSelectedArray = columnOptions.filter((key) => columnSelectedObj[key]);
  const handleColumnOptionsChange = (item: any) => {
    setColumnSelectedObj(item);
  };

  return (
    <Paper
      elevation={5}
      sx={{
        width: '100%',
        overflow: 'hidden',
        marginBottom: '2rem',
        position: 'relative',
      }}>
      <TableContainer component={Paper}>
        <TableColumnSelector
          columnOptions={columnOptions}
          columnSelectedObj={columnSelectedObj}
          defaultColumnSelectedObj={WORKFLOW_COLUMN_DISPLAY}
          handleColumnSelector={handleColumnOptionsChange}
        />
        <Table sx={{ minWidth: 700 }} size='small' aria-label='customized table'>
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

function CustomTableHead(props: any) {
  const { columnKey, order, orderBy, onRequestSort } = props;

  function updateSortItem(displayName: any) {
    onRequestSort(displayName);
  }
  return (
    <TableHead sx={{ height: '60px' }}>
      <TableRow>
        {/* DETAILS information */}
        <TableCell>
          <Typography sx={{ fontWeight: 500 }}>Details</Typography>
        </TableCell>

        {columnKey.map((columnObject: any, index: any) => (
          <TableCell key={index}>
            <TableSortLabel
              active={orderBy === columnObject}
              direction={orderBy === columnObject ? order : 'asc'}
              onClick={() => updateSortItem(columnObject)}>
              <Typography sx={{ fontWeight: 500 }}>{toTitle(columnObject)}</Typography>
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
function DetailButton(props: any) {
  const { jsonData } = props;

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const handleSetIsOpen = (value: any) => {
    setIsDetailOpen(value);
  };

  return (
    <>
      <IconButton onClick={() => setIsDetailOpen(true)}>
        <InfoIcon />
      </IconButton>
      <JSONTable jsonData={jsonData} isOpen={isDetailOpen} handleSetIsOpen={handleSetIsOpen} />
    </>
  );
}

function TableCellData(props: any) {
  const { obj_item, curr_key } = props;
  if (curr_key === 'end_status') {
    return <StatusChip status={obj_item[curr_key]} isClick={undefined} handleClick={undefined} />;
  }

  // Converting time to be more readable
  if (curr_key === 'start' || curr_key === 'end') {
    // Return Empty when it is null
    if (obj_item[curr_key] == null) return '';

    const date_utc = new Date(obj_item[curr_key]);
    return date_utc.toLocaleString('en-GB');
  }

  return `${obj_item[curr_key]}` === 'null' ? '-' : `${obj_item[curr_key]}`;
}

function CustomTableBody(props: any) {
  const { listItem, columnSelectedObj, order, orderBy } = props;

  return (
    <TableBody>
      {sortTableValues(listItem, order, orderBy).map((item: any, index: any) => (
        <TableRow key={index}>
          {/* DETAIL JSON BUTTON */}
          <TableCell>
            <DetailButton jsonData={item} />
          </TableCell>

          {columnSelectedObj.map((key: any, objIndex: any) => (
            <TableCell align='left' key={objIndex}>
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

function CustomPaginationTable(props: any, handlePaginationPropsChange: any) {
  const handleChangeRowsPerPage = (event: any) => {
    handlePaginationPropsChange((prevState: any) => {
      return {
        ...prevState,
        page: 0 + 1, // Pagination starts at 1
        rowsPerPage: parseInt(event.target.value, 10),
      };
    });
  };

  const handleChangePage = (newPage: any) => {
    handlePaginationPropsChange((prevState: any) => {
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
        component='div'
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

function sortTableValues(dataList: any, order: any, orderBy: any) {
  if (!orderBy || dataList.length === 0) {
    return dataList;
  } else {
    return dataList.sort((a: any, b: any) => {
      let result = 0;
      if (b[orderBy] < a[orderBy]) result = 1;
      if (b[orderBy] > a[orderBy]) result = -1;

      if (order === 'desc') {
        result = result * -1;
      }
      return result;
    });
  }
}
