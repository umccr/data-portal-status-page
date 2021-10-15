import React, { useContext, createContext, useState } from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Context to store logged in user information
export const DialogContext = createContext(false);

export function useDialogContext() {
  return useContext(DialogContext);
}

export default function DialogComponent(props) {
  const [dialogInfo, setDialogInfo] = useState({
    isOpen: false,
    dialogTitle: "",
    dialogContent: "",
  });

  // Reset Dialog when Close
  const handleClose = () =>
    setDialogInfo({
      isOpen: false,
      dialogTitle: "",
      dialogContent: "",
    });

  return (
    <>
      <Dialog open={dialogInfo.isOpen} onClose={handleClose}>
        <DialogTitle>{dialogInfo.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogInfo.dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render The rest of the Component */}
      <DialogContext.Provider value={{ setDialogInfo }}>
        {props.children}
      </DialogContext.Provider>
    </>
  );
}
