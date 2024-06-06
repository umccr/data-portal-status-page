import React, { useEffect, useState } from 'react';

// MaterialUI component
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';

// Custom Component
import { useStatusToolbarContext } from './StatusToolbar';
import StatusListsView from './views/StatusListView';
import StatusTabView from './views/StatusTabView';

import { SUPPORTED_PIPELINE, groupListBasedOnKey, uniqueArray } from '../../utils/Constants';

function StatusIndex(props: any) {
  // Props for metadata
  const { metadataList } = props;

  const toolbarState = useStatusToolbarContext();
  const statusFilterArray = toolbarState.status;
  const toggleView = toolbarState.toggleView;
  const [isLoading, setIsLoading] = useState(true);
  const [metadataGrouped, setMetadataGrouped] = useState({});

  // Pipeline List to dislay (to ensure order of workflow)
  const [pipelineDisplay, setPipelineDisplay] = useState<any[]>([]);

  useEffect(() => {
    let componentUnmount = false;

    async function filterAndGroup(data: any[]) {
      setIsLoading(true);
      let rawData = [...data];

      const groupedDataResult = groupListBasedOnKey(rawData, 'type');

      if (componentUnmount) return;

      setMetadataGrouped(groupedDataResult);

      // To have an order which metadata type to be displayed on top
      setPipelineDisplay(
        uniqueArray([...SUPPORTED_PIPELINE, ...Object.keys(groupedDataResult)]).filter(
          (eachPipeline) => {
            return groupedDataResult[eachPipeline] !== undefined;
          }
        )
      );
      setIsLoading(false);
    }

    filterAndGroup(metadataList);

    return () => {
      componentUnmount = true;
    };
  }, [metadataList, statusFilterArray]);
  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Container maxWidth={false} sx={{ padding: '20px 20px' }}>
          {Object.keys(metadataGrouped).length === 0 ? (
            <Typography variant='h5' sx={{ textAlign: 'center', padding: '50px' }}>
              Sorry! No Metadata Found
            </Typography>
          ) : (
            <>
              {toggleView === 'tab' ? (
                <StatusTabView
                  metadataGrouped={metadataGrouped}
                  pipelineDisplay={pipelineDisplay}
                />
              ) : (
                <StatusListsView
                  metadataGrouped={metadataGrouped}
                  pipelineDisplay={pipelineDisplay}
                />
              )}
            </>
          )}
        </Container>
      )}
    </>
  );
}

export default StatusIndex;
