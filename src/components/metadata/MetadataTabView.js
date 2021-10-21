import * as React from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import MetadataPipelineTable from "./MetadataPipelineTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

function MetadataTabView(props) {
  const { pipelineDisplay, metadataGrouped } = props;

  const [tabValue, setTabValue] = React.useState(pipelineDisplay[0]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tabValue} onChange={handleChange} aria-label="pipeline tabs">
        {pipelineDisplay.map((eachPipeline) => (
          <Tab
            key={eachPipeline}
            value={eachPipeline}
            label={eachPipeline}
            sx={{ textTransform: "None" }}
          />
        ))}
      </Tabs>
      {/* <MetadataPipelineTable
        metadataGrouped={metadataGrouped}
        pipelineType={pipelineDisplay[tabValue]}
      /> */}
      {pipelineDisplay.map((eachPipeline) => (
        <TabPanel key={eachPipeline} value={tabValue} index={eachPipeline}>
          <MetadataPipelineTable
            metadataGrouped={metadataGrouped}
            pipelineType={eachPipeline}
            noTitle
          />
        </TabPanel>
      ))}
    </Box>
  );
}

export default MetadataTabView;
