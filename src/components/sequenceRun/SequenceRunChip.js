import React from 'react'
import Chip from "@mui/material/Chip";

function colorForStatus(status) {
  switch (status.toLowerCase()) {
    case "complete":
      // Green color
      return "#C8E6C9";
    default:
      // Orange Color
      return "#FFE0B2";
  }
}

function SequenceRunChip({status}) {
  return (
    <Chip
      label={status}
      sx={{ backgroundColor: colorForStatus(status), color: "black" }}
    />
  )
}

export default SequenceRunChip
