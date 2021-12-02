import React, { useEffect, useState } from "react";

// Aws amplify components
import { API } from "aws-amplify";

// Material Ui Component
import {
  Collapse,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
} from "@mui/material";

// Custom component
import { useDialogContext } from "../utils/DialogComponent";
import StatusTable from "./StatusTable";

function getInstrumentRunIdFromRGID(rgid){
  const rgid_split = rgid.split('.')

  return rgid_split[rgid_split.length - 2]
}

async function getWorkflowIdFromLibraryIdAndIntrumentRunId(library_id, instrument_run_id){

  const APIConfig = {
    queryStringParameters: {
      library_id: library_id,
      instrument_run_id: instrument_run_id
    },
  };

  const library_run_response = await API.get(
    "DataPortalApi",
    "/libraryrun/",
    APIConfig
  );
  
  const library_run = library_run_response.results[0]
  return library_run.workflows
}

async function createMetadataObjectFromTNPairing(TNPairingResponse) {
  const objectArray = [];

  const subject_id = TNPairingResponse.subject_id;

  // Taking from fastq_list_rows
  for (const eachSubject of TNPairingResponse.fastq_list_rows) {
    const instrument_run_id = getInstrumentRunIdFromRGID(eachSubject.rgid) 

    objectArray.push({
      subject_id: subject_id,
      library_id: eachSubject.rglb,
      sample_id: eachSubject.rgsm,
      workflow_id: await getWorkflowIdFromLibraryIdAndIntrumentRunId(eachSubject.rglb, instrument_run_id)
    });
  }

  for (const eachSubject of TNPairingResponse.tumor_fastq_list_rows) {
    const instrument_run_id = getInstrumentRunIdFromRGID(eachSubject.rgid) 

    objectArray.push({
      subject_id: subject_id,
      library_id: eachSubject.rglb,
      sample_id: eachSubject.rgsm,
      workflow_id: await getWorkflowIdFromLibraryIdAndIntrumentRunId(eachSubject.rglb, instrument_run_id)
    });
  }
  return objectArray;
}

function StatusPairing(props) {
  const { setDialogInfo } = useDialogContext();
  const { library_id, isOpen, numSpan } = props;

  const [pairingResponse, setPairingResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [metadataGrouped, setMetadataGrouped] = useState({ WGS: [] });

  // UseEffect to fetch pairing data associated with the library_id
  useEffect(() => {
    let componentUnmount = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Pairing API
        const APIConfig = {
          body: [library_id],
        };

        const pairingResponse = await API.post(
          "DataPortalApi",
          "/pairing/by_libraries/",
          APIConfig
        );
        
        let metadataList = [];

        // Grab a metadata list to be shown in the table if any
        if (pairingResponse.length > 0) {
          metadataList = await createMetadataObjectFromTNPairing(pairingResponse[0]);
        }

        // Set some state
        setPairingResponse(pairingResponse[0]);
        setMetadataGrouped({ WGS: metadataList });

        setIsLoading(false);
        if (componentUnmount) return;
      } catch (err) {
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Error",
          dialogContent:
            "Sorry, An error has occured when fetching T/N pairing data. Please try again!",
        });
      }
    };
    fetchData();

    return () => {
      componentUnmount = true;
    };
  }, [library_id, setDialogInfo]);

  return (
    <TableRow>
      <TableCell
        colSpan={numSpan}
        style={{
          padding: 0,
          textAlign: "center",
          backgroundColor: "#fff7f7",
        }}
      >
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {isLoading ? (
            <div style={{ padding: "20px" }}>
              <CircularProgress aria-label="circular-loader" />
            </div>
          ) : (
            <div style={{ padding: "0 3em 0 3em" }}>
              {pairingResponse ? (
                <StatusTable
                  noLinkIcon
                  pipelineType="WGS"
                  metadataGrouped={metadataGrouped}
                  title={"Pairing for " + pairingResponse.subject_id}
                />
              ) : (
                <Typography padding="20px 0 20px 0">
                  Sorry, no pairing data is found!
                </Typography>
              )}
            </div>
          )}
        </Collapse>
      </TableCell>
    </TableRow>
  );
}

export default StatusPairing;
