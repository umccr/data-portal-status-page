import React, { createContext, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Assuming useDialogContext is now correctly imported
// import { useDialogContext } from "./DialogComponent";

interface SearchContextType {
  query: string;
  // result: any; // Consider using a more specific type here
  searchHandler: (query: string) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType>({
  query: '',
  searchHandler: async () => {},
});

interface Props {
  children: React.ReactNode;
}

export function useSearchContext() {
  return useContext(SearchContext);
}

const SearchContextProvider: React.FC<Props> = ({ children }) => {
  // Assuming dialog and loading state are needed
  // const { setDialogInfo } = useDialogContext();
  const [query, setQuery] = useState('');
  // const [result, setResult] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const searchHandler = async (query: string) => {
    // setIsLoading(true);
    try {
      // Simulate an API call to fetch results
      // const result = await fetchResults(query);
      history.push({ pathname: '/libraryrun', search: `?search=${query}` });
      setQuery(query);
      // setResult(result);
    } catch (error) {
      console.error('Failed to perform search', error);
      // setDialogInfo({ title: "Error", message: "Search failed" });
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        searchHandler,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
