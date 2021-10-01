import React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import SequenceRunChip from "./SequenceRunChip";
import MetadataTable from "../metadata/MetadataTable";

function getDateTimeString(iso_string) {
  let dateTime = new Date(iso_string);
  return dateTime.toLocaleString("en-GB");
}

function SequenceRunRow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{width:"100%"}}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            paddingTop="10px"
            paddingBottom="10px"
            paddingRight="10px"
          >
            <Grid
              item
              container
              xs={1}
              justifyContent="center"
              alignItems="center"
            >
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Grid>

            <Grid
              item
              xs={11}
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={0}
              padding={0.5}
            >
              {/* Row for sequence run Name and status */}
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography display="inline" sx={{ fontWeight: "bold" }}>
                    Sequence Run:{" "}
                  </Typography>
                  <Typography display="inline" sx={{ fontWeight: "medium" }}>
                    {row.instrument_run_id}
                  </Typography>
                </Grid>
                <Grid item>
                  <SequenceRunChip status={row.status} />
                </Grid>
              </Grid>

              {/* Row for row_id and date_modified */}
              <Grid
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {/* Place Holder for Number of Workflow has completed */}

                {/* <Grid item>
                <Typography display="inline" sx={{ fontWeight: "regular" }}>
                  run_id:{" "}
                </Typography>
                <Typography display="inline" sx={{ fontWeight: "light" }}>
                  {row.instrument_run_id}
                </Typography>
              </Grid> */}
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    sx={{ fontWeight: "light" }}
                  >
                    date_modified:{" "}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    sx={{ fontWeight: "light" }}
                  >
                    {getDateTimeString(row.date_modified)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MetadataTable />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default SequenceRunRow;
