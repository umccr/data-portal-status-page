import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import StatusTable from '../StatusTable';

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  index: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
};

interface StatusTabViewProps {
  pipelineDisplay: string[];
  metadataGrouped: any; // Specify a more detailed type if possible
}

const StatusTabView: React.FC<StatusTabViewProps> = ({ pipelineDisplay, metadataGrouped }) => {
  const [tabValue, setTabValue] = React.useState<string>(pipelineDisplay[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleChange} aria-label='pipeline tabs'>
        {pipelineDisplay.map((eachPipeline) => (
          <Tab
            key={eachPipeline}
            value={eachPipeline}
            label={eachPipeline}
            sx={{ textTransform: 'None' }}
          />
        ))}
      </Tabs>
      {pipelineDisplay.map((eachPipeline) => (
        <TabPanel key={eachPipeline} value={tabValue} index={eachPipeline}>
          <StatusTable metadataGrouped={metadataGrouped} pipelineType={eachPipeline} noTitle />
        </TabPanel>
      ))}
    </Box>
  );
};

export default StatusTabView;
