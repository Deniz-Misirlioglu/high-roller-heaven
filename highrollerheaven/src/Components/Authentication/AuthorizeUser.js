import { createContext, useState } from "react";

const AuthorizedUserContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authorize, setAuthorize] = useState({});

  return (
    <AuthorizedUserContext.Provider value={{ authorize, setAuthorize }}>
      {children}
    </AuthorizedUserContext.Provider>
  );
};

export default AuthorizedUserContext;
