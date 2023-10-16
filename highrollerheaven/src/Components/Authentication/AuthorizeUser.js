import { createContext, useState } from "react";

const AuthorizedUserContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authorize, setAuth] = useState({});

  return (
    <AuthorizedUserContext.Provider value={{ authorize, setAuth }}>
      {children}
    </AuthorizedUserContext.Provider>
  );
};

export default AuthorizedUserContext;
