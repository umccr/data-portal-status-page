import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import WorkflowChip from "./WorkflowChip";

import { WORKFLOW_STATUS } from "../utils/Constants";

function WorkflowFilter() {
  const [statusFilterArray, setStatusFilterArray] = useState([]);

  function handleOnClick(status) {
    if (statusFilterArray.includes(status)) {
      setStatusFilterArray(
        statusFilterArray.filter((currentFilter) => currentFilter !== status)
      );
    } else {
      setStatusFilterArray((prevState) => [...prevState, status]);
    }
  }


  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
      sx={{ paddingBottom: "8px" }}
    >
      <Grid item>
        <Typography>Filter by</Typography>
      </Grid>
      <Grid sx={{ width: "auto" }} item container spacing={0.2}>
        {WORKFLOW_STATUS.map((status) => (
          <Grid item>
            <WorkflowChip
              isClick={statusFilterArray.includes(status) ? true : false}
              status={status}
              isClickable={true}
              handleClick={() => handleOnClick(status)}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default WorkflowFilter;
