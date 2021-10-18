import React from "react";
import TablePagination from "@mui/material/TablePagination";

function Pagination(props) {
  const { pagination, handleChangeQuery } = props;

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
    <TablePagination
      sx={{ display: "flex", justifyContent: "center" }}
      component="div"
      count={pagination.count}
      page={pagination.page - 1}
      onPageChange={handleChangePage}
      rowsPerPage={pagination.rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}

export default Pagination;
