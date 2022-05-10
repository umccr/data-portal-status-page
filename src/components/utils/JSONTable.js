import React, { useState } from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

// Context to store logged in user information

export default function JSONTable(props) {
  const { jsonData, isOpen, handleSetIsOpen } = props;

  // Reset Dialog when Close
  const handleClose = () => handleSetIsOpen(false);

  const jsonKeys = Object.keys(jsonData);

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        {/* <DialogTitle>{dialogInfo.dialogTitle}</DialogTitle> */}
        <DialogContent>
          <Table>
            <TableBody>
              {jsonKeys.map((key) => (
                <TableRow>
                  <TableCell>{key}</TableCell>
                  <TableCell>{jsonData[key]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
