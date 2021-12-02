import React from "react";
import Chip from "@mui/material/Chip";

import { green, orange, red } from "@mui/material/colors";

function getStyleForStatus(status, isSelected) {
  const baseStyle = { fontWeight: "Medium", fontSize: "11px", margin: "0 0.25rem 0 0.25rem" };

  switch (status.toLowerCase()) {
    case "succeeded":
      return { ...baseStyle, backgroundColor: green[100]};

    case "started":
      return { ...baseStyle, backgroundColor: orange[100] };

    case "failed":
      return { ...baseStyle, backgroundColor: red[100] };

    default:
      return {...baseStyle};
  }
}

function SequenceRunChip({label, status}) {
  return (
    <Chip label={label} sx={getStyleForStatus(status)} />
  );
}

export default SequenceRunChip;
