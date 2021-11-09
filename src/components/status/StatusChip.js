import React from "react";
import Chip from "@mui/material/Chip";
import { green, orange, red, brown } from "@mui/material/colors";

// Color selection based on https://materialui.co/colors/ color palette
// Color name from the color header and numbers are color Id

function getStyleForStatus(status, isSelected) {
  const baseStyle = { fontWeight: "Medium" };

  if (isSelected) {
    baseStyle["border"] = "2px solid";
  }

  switch (status.toLowerCase()) {
    case "succeeded":
      // Green color
      return { ...baseStyle, backgroundColor: green[100], color: green[900] };
    case "running":
      // Orange color
      return { ...baseStyle, backgroundColor: orange[100], color: orange[800] };
    case "failed":
      // Pink color
      return { ...baseStyle, backgroundColor: red[100], color: red[400] };
    case "aborted":
      // Brown color
      return { ...baseStyle, backgroundColor: brown[100], color: brown[500] };
    default:
      // Default style for unknown type
      return {};
  }
}

function StatusChip({ status, isClick, handleClick }) {
  return (
    <Chip
      onClick={handleClick}
      label={status}
      sx={getStyleForStatus(status, isClick)}
    />
  );
}

export default StatusChip;
