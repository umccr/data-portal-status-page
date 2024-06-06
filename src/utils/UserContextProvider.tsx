import { useContext, createContext, useState } from 'react';

// Context to store logged in user information
export const UserContext = createContext<any>(null);

export function useUserContext() {
  return useContext(UserContext);
}

function UserContextProvider(props: any) {
  const [user, setUser] = useState(undefined);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
