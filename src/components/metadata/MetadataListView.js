import React from "react";
import MetadataPipelineTable from "./MetadataPipelineTable";

function MetadataListView(props) {
  const { pipelineDisplay, metadataGrouped } = props;
  return (
    <>
      {pipelineDisplay.map((pipelineType) => (
        <MetadataPipelineTable
          key={pipelineType}
          metadataGrouped={metadataGrouped}
          pipelineType={pipelineType}
        />
      ))}
    </>
  );
}

export default MetadataListView;
