import { styled } from '@mui/material/styles';
import { TableRow, TableCell } from "@mui/material";
import { FIELD_TO_DISPLAY } from "../utils/Constants";
import React from "react";
import WorkflowChip from "./WorkflowChip";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function MetadataRow(props) {
  const metadata = props.metadata;
  const workflow_list = props.workflow_list;
  return (
    <StyledTableRow>
      {FIELD_TO_DISPLAY.map((field_name, index) => (
        <TableCell key={index} sx={{ textAlign: "center" }}>
          {metadata[field_name]}
        </TableCell>
      ))}

      {workflow_list.map((field_name, index) => (
        <TableCell key={index} sx={{ textAlign: "center" }}>
          <WorkflowChip status="Succeeded" />
        </TableCell>
      ))}
    </StyledTableRow>
  );
}

export default MetadataRow;
