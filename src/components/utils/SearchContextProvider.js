import React, { createContext, useContext } from "react";

import { useHistory } from "react-router-dom";

// Custom Component
// import { useDialogContext } from "./DialogComponent";

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
  // const { setDialogInfo } = useDialogContext();

  // const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const searchHandler = async (query) => {
    history.push({ pathname: "/libraryrun", search: `?search=${query}` });
  };

  return (
    <SearchContext.Provider
      value={{
        searchHandler,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
