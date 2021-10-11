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
import { grey } from "@mui/material/colors";

function getDateTimeString(iso_string) {
  let dateTime = new Date(iso_string);
  return dateTime.toLocaleString("en-GB");
}

function SequenceRunRow(props) {
  const { data } = props;
  const [isOpen, setIsOpen] = React.useState(false);

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
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                    {data.instrument_run_id}
                  </Typography>
                </Grid>
                <Grid item>
                  <SequenceRunChip status={data.status} />
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
                    {getDateTimeString(data.date_modified)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ backgroundColor:grey[50], paddingBottom: 0, paddingTop: 0, textAlign:"center" }} >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <MetadataTable instrument_run_id={data.instrument_run_id} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default SequenceRunRow;
