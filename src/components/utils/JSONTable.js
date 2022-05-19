import React from "react";

// mui- components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

function JSONTable(props) {
  const { JSONData } = props;

  return (
    <Table>
      <TableBody>
        {Object.keys(JSONData).map((key) => {
          const value = JSONData[key];
          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {((key === "input") | (key === "output")) & (value != null) ? (
                  <JSONTable JSONData={JSON.parse(value)} />
                ) : (
                  JSON.stringify(value)
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function JSONTableDialog(props) {
  const { jsonData, isOpen, handleSetIsOpen } = props;

  // Reset Dialog when Close
  const handleClose = () => handleSetIsOpen(false);

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        {/* <DialogTitle>{dialogInfo.dialogTitle}</DialogTitle> */}
        <DialogContent>
          <JSONTable JSONData={jsonData} />
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
