import React, { useState, createContext, useContext } from "react";

export const SearchContext = createContext({
  query: "",
  result: {},
});

export function useSearchContext() {
  return useContext(SearchContext);
}

// Defining a simple HOC component
const SearchContextProvider = (props) => {
  const [queryInput, setQueryInput] = useState("");
  const [queryResult, setQueryResult] = useState({});

  return (
    <SearchContext.Provider
      value={{
        queryInput,
        setQueryInput,
        queryResult
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
