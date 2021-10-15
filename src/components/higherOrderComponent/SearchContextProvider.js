import React, { useState, createContext, useContext, useEffect } from "react";

import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";

// Custom Component
import { useDialogContext } from "./DialogComponent";

export const SearchContext = createContext({
  query: "",
  result: {},
});

export function useSearchContext() {
  return useContext(SearchContext);
}

// Defining a simple HOC component
const SearchContextProvider = (props) => {
  // Error
  const { setDialogInfo } = useDialogContext();

  const [queryResult, setQueryResult] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // Search Lookup on API
  const fetchData = async (queryInput) => {
    setIsLoading(true);
    try {
      // Check if Search value is in metadata table
      const APIConfig = {
        queryStringParameters: {
          search: queryInput,
        },
      };
      const metadataResponse = await API.get(
        "DataPortalApi",
        "/metadata",
        APIConfig
      );
      const metadataArray = metadataResponse.results;
      if (metadataArray.length > 0) {
        // Found matching data! Just need to find workflow for each metadata

        const library_workflow = {};
        for (const eachMetadata of metadataArray) {
          const library_id = eachMetadata.library_id;

          // Query Workflow Associated with the library ID
          const APIConfig = {
            queryStringParameters: {
              library_id: library_id,
            },
          };
          const workflowResponse = await API.get(
            "DataPortalApi",
            "/workflows/by_library_id",
            APIConfig
          );

          library_workflow[library_id] = {
            metadata: eachMetadata,
            workflows: workflowResponse.results,
          };
        }
        // Set found data at setState
        setQueryResult({
          metadataSearch: library_workflow,
        });
      } else {
        // Try to find query keyword from sequence! Hopefully it is there
        const APIConfig = {
          queryStringParameters: {
            search: queryInput,
          },
        };

        const sequenceResponse = await API.get(
          "DataPortalApi",
          "/sequence",
          APIConfig
        );
        const sequenceArray = sequenceResponse.results;

        if (sequenceArray.length > 0) {
          // Found it! Set the value at setState

          setQueryResult({
            sequence: sequenceArray,
          });
        } else {
          // Announcing no found data through HOC Dialog Component
          setDialogInfo({
            isOpen: true,
            dialogTitle: "Not Found",
            dialogContent:
              "Sorry, no matching data found in our database. Please try again!",
          });
        }
      }
    } catch (err) {
      setDialogInfo({
        isOpen: true,
        dialogTitle: "Error",
        dialogContent: "Sorry, An error has occured. Please try again!",
      });
    }
    setIsLoading(false);
  };
  const history = useHistory();
  const searchHandler = async (query) => {
    
    await fetchData(query);
    history.push("/search");
  };

  return (
    <SearchContext.Provider
      value={{
        searchHandler,
        queryResult,
      }}
    >
      <Dialog open={isLoading}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
