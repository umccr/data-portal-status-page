import React from 'react';
import StatusTable from '../StatusTable';

interface StatusListViewProps {
  pipelineDisplay: string[];
  metadataGrouped: any; // Replace 'any' with a more specific type
}

const StatusListView: React.FC<StatusListViewProps> = ({ pipelineDisplay, metadataGrouped }) => {
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
};

export default StatusListView;
