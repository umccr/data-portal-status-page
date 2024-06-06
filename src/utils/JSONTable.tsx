// mui- components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// Custom component
import { isJSONObject } from './Util';

function JSONTable(props: any) {
  const { JSONData } = props;
  return (
    <Table>
      <TableBody>
        {Object.keys(JSONData).map((key) => {
          const value = JSONData[key];

          // Check if value is a JSON object and can displayed as a table instead of a string
          let isJSONValue = false;
          try {
            const parsedJSON = JSON.parse(value);
            if (isJSONObject(parsedJSON)) {
              isJSONValue = true;
            }
          } catch (err) {
            /* pass empty */
          }

          return (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                {isJSONValue ? <JSONTable JSONData={JSON.parse(value)} /> : JSON.stringify(value)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function JSONTableDialog(props: any) {
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
          <Button variant='outlined' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
