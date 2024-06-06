import React, { useState } from 'react';

// mui- components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface TableColumnSelectorProps {
  handleColumnSelector: (columnSelectedObj: { [key: string]: boolean }) => void;
  defaultColumnSelectedObj: { [key: string]: boolean };
  columnSelectedObj: { [key: string]: boolean };
  columnOptions: string[];
}

const TableColumnSelector: React.FC<TableColumnSelectorProps> = ({
  handleColumnSelector,
  defaultColumnSelectedObj,
  columnSelectedObj,
  columnOptions,
}) => {
  const [isColumSelectorOpen, setIsColumSelectorOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleColumnSelector({
      ...columnSelectedObj,
      [event.target.name]: event.target.checked,
    });
  };

  const handleReset = () => {
    handleColumnSelector({ ...defaultColumnSelectedObj });
  };

  return (
    <>
      <IconButton
        onClick={() => setIsColumSelectorOpen(true)}
        sx={{ position: 'absolute', right: '-0.3rem', top: '0.5rem', zIndex: 999 }}>
        <MoreVertIcon />
      </IconButton>
      <Dialog open={isColumSelectorOpen} onClose={() => setIsColumSelectorOpen(false)}>
        <DialogContent sx={{ width: '20rem' }}>
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
              <FormLabel component='legend'>Select column to display</FormLabel>
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
          <Button variant='outlined' onClick={handleReset}>
            Reset
          </Button>
          <Button variant='outlined' onClick={() => setIsColumSelectorOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableColumnSelector;
