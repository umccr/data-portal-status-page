import { useContext, createContext } from "react";

// Context to store logged in user information
export const UserContext = createContext(null);

export function useUserContext() {
  return useContext(UserContext);
}

