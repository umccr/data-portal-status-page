import React, { useState } from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function TableColumnSelector(props) {
  const { handleColumnSelector, columnSelectedObj, columnOptions } = props;

  const [isColumSelectorOpen, setIsColumSelectorOpen] = useState(false);

  const handleChange = (event) => {
    handleColumnSelector({
      ...columnSelectedObj,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <>
      <IconButton
        onClick={() => setIsColumSelectorOpen(true)}
        sx={{ position: "absolute", right: "-0.3rem", top: "0.5rem" }}
      >
        <MoreVertIcon />
      </IconButton>
      <Dialog
        open={isColumSelectorOpen}
        onClose={() => setIsColumSelectorOpen(false)}
      >
        {/* <DialogTitle>{dialogInfo.dialogTitle}</DialogTitle> */}
        <DialogContent sx={{ width: "20rem" }}>
          <Box sx={{ display: "flex" }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">Select column to display</FormLabel>
              <FormGroup>
                {columnOptions.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        checked={columnSelectedObj[item]}
                        onChange={handleChange}
                        name={item}
                      />
                    }
                    label={item}
                  />
                ))}
              </FormGroup>
              <FormHelperText>Default sort is by descending Id</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => setIsColumSelectorOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
