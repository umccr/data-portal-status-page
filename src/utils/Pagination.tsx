import React from 'react';
import { TablePagination, Typography } from '@mui/material';

function Pagination(props) {
  const { pagination, handleChangeQuery, paginationName } = props;

  // Pagination Handler
  const handleChangePage = (event, newPage) => {
    handleChangeQuery((prevState) => {
      return {
        ...prevState,
        page: newPage + 1,
      };
    });
  };

  const handleChangeRowsPerPage = (event) => {
    handleChangeQuery((prevState) => {
      return {
        ...prevState,
        page: 0 + 1, // Pagination starts at 1
        rowsPerPage: parseInt(event.target.value, 10),
      };
    });
  };

  return (
    <>
      <TablePagination
        sx={{ display: 'flex', justifyContent: 'center' }}
        component='div'
        count={pagination.count}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={pagination.rowsPerPage}
        showFirstButton={true}
        showLastButton={true}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 50, 100, 200, 300]}
      />
      <Typography
        variant='caption'
        display='block'
        sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1em' }}>
        *Pagination is based on {paginationName} results
      </Typography>
    </>
  );
}

export default Pagination;
