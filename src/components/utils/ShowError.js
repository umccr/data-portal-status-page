import React from "react";

import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ShowError({ handleError, isError }) {
  const handleClose = () => handleError(false);

  return (
    <>
      <Dialog open={isError} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sorry, An error has occured. Please try again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
