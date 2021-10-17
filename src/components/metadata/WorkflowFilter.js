import React, { useState, useContext, createContext } from "react";

// MUI component
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// Custom Component
import WorkflowChip from "./WorkflowChip";
import { WORKFLOW_STATUS } from "../utils/Constants";

// Context to store logged in user information
export const FilterContext = createContext(null);

export function useFilterContext() {
  return useContext(FilterContext);
}

function WorkflowFilter(props) {
  const [statusFilterArray, setStatusFilterArray] = useState(WORKFLOW_STATUS);

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
    <FilterContext.Provider value={{ statusFilterArray }}>
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
          {WORKFLOW_STATUS.map((status, index) => (
            <Grid key={index} item>
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
      {props.children}
    </FilterContext.Provider>
  );
}

export default WorkflowFilter;
