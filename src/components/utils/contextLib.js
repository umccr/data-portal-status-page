import { useContext, createContext } from "react";

// Context to store logged in user information
export const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

// Context for data query
export const SearchQueryContext = createContext(null);

export function useSearchQueryContext() {
  return useContext(SearchQueryContext);
}