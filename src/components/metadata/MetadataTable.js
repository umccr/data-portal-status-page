import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";

// MaterialUI component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { TableContainer, LinearProgress } from "@mui/material";

// Custom Component
import MetadataRow from "./MetadataRow";
import { useFilterContext } from "./WorkflowFilter";

import {
  WORKFLOW_PIPELINE,
  FIELD_TO_DISPLAY,
  WORKFLOW_STATUS_LENGTH,
  convertToDisplayName
} from "../utils/Constants";



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

function groupMetadataBasedOnType(metadataList) {
  const groupedMetadata = {};
  for (const metadata of metadataList) {
    const metadataType = metadata.type;

    if (groupedMetadata[metadataType]) {
      groupedMetadata[metadataType] = [
        ...groupedMetadata[metadataType],
        metadata,
      ];
    } else {
      groupedMetadata[metadataType] = [metadata];
    }
  }
  return groupedMetadata;
}

function MetadataTable(props) {
  // Props for metadata
  const { metadataList } = props;

  const { statusFilterArray } = useFilterContext();
  const [isLoading, setIsLoading] = useState(true);
  const [metadataGrouped, setMetadataGrouped] = useState({});

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
      const groupedDataResult = groupMetadataBasedOnType(rawData);

      if (componentUnmount) return;

      setMetadataGrouped(groupedDataResult);
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
              {Object.keys(metadataGrouped).map((pipeline_type) => (
                <TableContainer key={pipeline_type} sx={{ textAlign: "left" }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {pipeline_type}
                  </Typography>

                  <TableContainer
                    sx={{ width: "100%", overflowX: "auto", borderRadius: 2 }}
                  >
                    <Table
                      sx={{ tableLayout: "fixed" }}
                      size="small"
                      aria-label="MetaData"
                    >
                      {/* Display Table Headers */}
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#CFD8DC" }}>
                          {/* Display metadata Headers */}
                          {FIELD_TO_DISPLAY.map((field_name, index) => (
                            <TableCell
                              key={index}
                              sx={{ textAlign: "center", width: "100px" }}
                            >
                              {convertToDisplayName(field_name)}
                            </TableCell>
                          ))}

                          {/* Display Workflows header if any*/}
                          {WORKFLOW_PIPELINE[pipeline_type] ? (
                            <>
                              {WORKFLOW_PIPELINE[pipeline_type].map(
                                (field_name, index) => (
                                  <TableCell
                                    key={index}
                                    sx={{ textAlign: "center", width: "100px" }}
                                  >
                                    {field_name}
                                  </TableCell>
                                )
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </TableRow>
                      </TableHead>

                      {/* Display Body content */}
                      <TableBody>
                        {metadataGrouped[pipeline_type].map(
                          (metadata, index) => (
                            <MetadataRow
                              key={index}
                              metadata={metadata}
                              workflow_list={WORKFLOW_PIPELINE[pipeline_type]}
                            />
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TableContainer>
              ))}
            </>
          )}
        </Container>
      )}
    </>
  );
}

export default MetadataTable;
