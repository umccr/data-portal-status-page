import React from "react";

// MaterialUI component
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Custom Component
import MetadataRow from "./MetadataRow";

import {
  WORKFLOW_PIPELINE,
  FIELD_TO_DISPLAY,
  CONVERT_TO_DISPLAY_NAME,
} from "../utils/Constants";

import { TableContainer } from "@mui/material";

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
  const metadataGrouped = groupMetadataBasedOnType(metadataList);

  return (
    <>
      <Container sx={{ padding: "20px 20px" }}>
        {metadataList.length === 0 ? (
          <Typography
            variant="h5"
            sx={{ textAlign: "center", padding: "50px"}}
          >
            Sorry! No Metadata Found
          </Typography>
        ) : (
          <>
            {Object.keys(metadataGrouped).map((pipeline_type, index) => (
              <TableContainer key={index} sx={{ textAlign: "left" }}>
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
                            {CONVERT_TO_DISPLAY_NAME[field_name]}
                          </TableCell>
                        ))}

                        {/* Display Workflows header */}
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
                      </TableRow>
                    </TableHead>

                    {/* Display Body content */}
                    <TableBody>
                      {metadataGrouped[pipeline_type].map((metadata, index) => (
                        <MetadataRow
                          key={index}
                          metadata={metadata}
                          workflow_list={WORKFLOW_PIPELINE[pipeline_type]}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableContainer>
            ))}
          </>
        )}
      </Container>
    </>
  );
}

export default MetadataTable;
