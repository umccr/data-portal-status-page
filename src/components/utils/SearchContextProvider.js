import React, { useState, createContext, useContext } from "react";

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
        // Found matching metadata! Just need to find workflow for each metadata

        // Set found data at setState
        setQueryResult({
          metadataSearch: metadataArray,
        });

        setIsLoading(false);

        // Return value to which redirect the query
        return "metadata";
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
            sequenceSearch: sequenceArray,
          });

          setIsLoading(false);
          // Return type where to push
          return "sequence";
        }

        setIsLoading(false);
        // Announcing no found data through HOC Dialog Component
        setDialogInfo({
          isOpen: true,
          dialogTitle: "Not Found",
          dialogContent:
            "Sorry, no matching data found in our database. Please try again!",
        });
      }
    } catch (err) {
      setIsLoading(false);
      setDialogInfo({
        isOpen: true,
        dialogTitle: "Error",
        dialogContent: "Sorry, An error has occured. Please try again!",
      });
    }
  };
  const history = useHistory();
  const searchHandler = async (query) => {
    const queryType = await fetchData(query);
    if (queryType === "metadata") {
      history.push({ pathname: "/metadata", search: `?search=${query}` });
    } else if (queryType === "sequence") {
      history.push({ pathname: "/sequence", search: `?search=${query}` });
    }
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
