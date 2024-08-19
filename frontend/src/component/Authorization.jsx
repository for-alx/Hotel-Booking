import { Outlet, Navigate } from "react-router-dom"
import { useGlobalContext } from "../context/GlobalContext"


const Authorization = ({ allowedRoles }) => {
    const { user, auth } = useGlobalContext()
    
    return (
        user && allowedRoles?.includes(user?.role) ?
            <Outlet />
        : auth ?
            <Navigate to="/unauthorized" replace />
        :
            <Navigate to="/signin" replace />
    )
}

export default Authorization
