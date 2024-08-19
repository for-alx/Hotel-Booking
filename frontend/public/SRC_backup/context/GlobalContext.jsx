import { createContext, useContext, useState } from "react"

const AppContext = createContext()

const AppProvider = ({ children }) => { 
    const [auth, setAuth] = useState(sessionStorage.getItem("accessToken"))
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("_user")))

    return (
        <AppContext.Provider value={{ auth, setAuth, user, setUser }}>
            { children }
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppProvider }
