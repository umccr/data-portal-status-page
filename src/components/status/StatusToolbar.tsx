import { useState, useContext, createContext } from 'react';

// MUI component
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TabIcon from '@mui/icons-material/Tab';
import ListIcon from '@mui/icons-material/List';
import Toolbar from '@mui/material/Toolbar';
import styled from '@mui/material/styles/styled';
// Custom Component
import WorkflowChip from './StatusChip';
import { WORKFLOW_STATUS } from '../../utils/Constants';

export type StatusToolbarProps = {
  status: any;
  toggleView: any;
};
// Context to store logged in user information
export const StatusToolbarContext = createContext<StatusToolbarProps>({
  status: [],
  toggleView: 'tab',
});

export function useStatusToolbarContext() {
  return useContext(StatusToolbarContext);
}

// Styling Componentss
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    padding: 0,
    minHeight: '64px',
  },
  padding: 0,
  minHeight: '64px',
}));

function StatusToolbar(props: any) {
  const [toolbarState, setToolbarState] = useState<StatusToolbarProps>({
    status: [],
    toggleView: 'tab',
  });

  function handleOnClick(status: any) {
    if (toolbarState['status'].includes(status)) {
      setToolbarState((prevState) => ({
        ...prevState,
        status: prevState['status'].filter((currentFilter: any) => currentFilter !== status),
      }));
    } else {
      setToolbarState((prevState: any) => ({
        ...prevState,
        status: [...prevState['status'], status],
      }));
    }
  }

  function handleViewToggleChange(_event: React.SyntheticEvent, newValue: any) {
    if (newValue !== null) {
      setToolbarState((prevState) => ({
        ...prevState,
        toggleView: newValue,
      }));
    }
  }

  return (
    <StatusToolbarContext.Provider value={toolbarState}>
      <StyledToolbar>
        <Typography sx={{ paddingRight: '1em' }}>Filter by</Typography>
        <Grid sx={{ width: 'auto', flex: 1 }} item container spacing={0.2}>
          {WORKFLOW_STATUS.map((status: any, index) => (
            <Grid key={index} item>
              <WorkflowChip
                isClick={toolbarState['status'].includes(status) ? true : false}
                status={status}
                isClickable={true}
                handleClick={() => handleOnClick(status)}
              />
            </Grid>
          ))}
        </Grid>
        <ToggleButtonGroup
          value={toolbarState.toggleView}
          exclusive
          onChange={handleViewToggleChange}
          aria-label='ToggleView'
          sx={{ display: 'flex', justifyContent: 'right' }}>
          <ToggleButton value='tab' aria-label='tabView'>
            <TabIcon />
          </ToggleButton>
          <ToggleButton value='list' aria-label='listView'>
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </StyledToolbar>
      {props.children}
    </StatusToolbarContext.Provider>
  );
}

export default StatusToolbar;
