import { createContext, useState } from "react";

const AuthorizedUserContext = createContext({});

export const AuthProvider = ({ child }) => {
    const [authorize, setAuthorize] = useState({});

    return (
        <AuthorizedUserContext.Provider value={{ authorize, setAuthorize }}>
            {child}
        </AuthorizedUserContext.Provider>
    )

}

export default AuthorizedUserContext;