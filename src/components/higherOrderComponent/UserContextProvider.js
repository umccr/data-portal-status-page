import React, { useContext, createContext, useState } from "react";

// Context to store logged in user information
export const UserContext = createContext(null);

export function useUserContext() {
  return useContext(UserContext);
}

function UserContextProvider(props) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
