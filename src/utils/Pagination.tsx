import React from 'react';
import { TablePagination, Typography } from '@mui/material';

type QueryParameterType = {
  rowsPerPage: number;
  ordering: string;
  search: string;
};
interface PaginationProps {
  pagination: {
    count: number;
    page: number;
    rowsPerPage: number;
  };
  handleChangeQuery: (value: QueryParameterType) => void; // Consider specifying a more precise type for the state update function
  paginationName: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  handleChangeQuery,
  paginationName,
}) => {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    handleChangeQuery((prevState: any) => {
      // Consider specifying a more precise type for prevState
      return {
        ...prevState,
        page: newPage + 1,
      };
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChangeQuery((prevState: any) => {
      // Consider specifying a more precise type for prevState
      return {
        ...prevState,
        page: 1, // Reset to first page when rows per page changes
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
        page={pagination.page - 1} // Adjust page index for zero-based indexing
        onPageChange={handleChangePage}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 50, 100, 200, 300]}
        showFirstButton
        showLastButton
      />
      <Typography
        variant='caption'
        display='block'
        sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1em' }}>
        *Pagination is based on {paginationName} results
      </Typography>
    </>
  );
};

export default Pagination;
