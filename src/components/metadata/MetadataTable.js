import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";

// MaterialUI component
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";

// Custom Component
import { useMetadataToolbarContext } from "./MetadataToolbar";
import MetadataListsView from "./MetadataListView";

import {
  WORKFLOW_STATUS_LENGTH,
  SUPPORTED_PIPELINE,
  groupListBasedOnKey,
  uniqueArray,
} from "../utils/Constants";
import MetadataTabView from "./MetadataTabView";

function isDataFilteredOut(dataList, filterList) {
  for (const workflow of dataList) {
    const end_status = workflow.end_status;

    // If any of the data contain one of the filtered status
    // It will not filtered the data out
    if (filterList.includes(end_status)) {
      return false;
    }
  }
  return true;
}

function MetadataTable(props) {
  // Props for metadata
  const { metadataList } = props;

  const { toolbarState } = useMetadataToolbarContext();
  const statusFilterArray = toolbarState.status;
  const toggleView = toolbarState.toggleView;
  const [isLoading, setIsLoading] = useState(true);
  const [metadataGrouped, setMetadataGrouped] = useState({});

  // Pipeline List to dislay (to ensure order of workflow)
  const [pipelineDisplay, setPipelineDisplay] = useState([]);

  useEffect(() => {
    let componentUnmount = false;

    // Remove element from array if
    async function filterData(metadataListResult) {
      let i = metadataListResult.length;
      while (i--) {
        const metadata = metadataListResult[i];
        const library_id = metadata.library_id;

        const APIConfig = {
          queryStringParameters: {
            library_id: library_id,
          },
        };

        const responseWorkflow = await API.get(
          "DataPortalApi",
          "/workflows/by_library_id",
          APIConfig
        );

        if (isDataFilteredOut(responseWorkflow.results, statusFilterArray)) {
          metadataListResult.splice(i, 1);
        }
      }
      return metadataListResult;
    }

    async function filterAndGroup(data) {
      setIsLoading(true);
      let rawData = [...data];

      const workflowFilterLength = statusFilterArray.length;
      if (
        workflowFilterLength < WORKFLOW_STATUS_LENGTH &&
        workflowFilterLength > 0
      ) {
        await filterData(rawData);
      }
      const groupedDataResult = groupListBasedOnKey(rawData, "type");

      if (componentUnmount) return;

      setMetadataGrouped(groupedDataResult);

      // To have an order which metadata type to be displayed on top
      setPipelineDisplay(
        uniqueArray([
          ...SUPPORTED_PIPELINE,
          ...Object.keys(groupedDataResult),
        ]).filter((eachPipeline) => {
          return groupedDataResult[eachPipeline] !== undefined;
        })
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
        <Container sx={{ padding: "20px 20px" }}>
          {Object.keys(metadataGrouped).length === 0 ? (
            <Typography
              variant="h5"
              sx={{ textAlign: "center", padding: "50px" }}
            >
              Sorry! No Metadata Found
            </Typography>
          ) : (
            <>
              {toggleView === "tab" ? (
                <MetadataTabView
                  metadataGrouped={metadataGrouped}
                  pipelineDisplay={pipelineDisplay}
                />
              ) : (
                <MetadataListsView
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

export default MetadataTable;
