import React, { useContext, createContext, useState } from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Context to store logged in user information
export const ErrorContext = createContext(false);

export function useErrorContext() {
  return useContext(ErrorContext);
}

export default function ErrorContextProvider(props) {
  const [isError, setIsError] = useState(false);

  const handleClose = () => setIsError(false);

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

      {/* Render The rest of the Component */}
      <ErrorContext.Provider value={{ setIsError }}>
        {props.children}
      </ErrorContext.Provider>
    </>
  );
}
