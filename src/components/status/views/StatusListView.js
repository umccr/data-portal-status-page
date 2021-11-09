import React from "react";
import StatusTable from "../StatusTable";

function StatusListView(props) {
  const { pipelineDisplay, metadataGrouped } = props;
  return (
    <>
      {pipelineDisplay.map((pipelineType) => (
        <StatusTable
          key={pipelineType}
          metadataGrouped={metadataGrouped}
          pipelineType={pipelineType}
        />
      ))}
    </>
  );
}

export default StatusListView;
