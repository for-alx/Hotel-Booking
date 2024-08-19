import { Outlet, useNavigate } from "react-router-dom"
import { useGlobalContext } from "../context/GlobalContext"
import { useEffect } from "react"


const PersistLogin = () => {
    const { auth } = useGlobalContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!auth) {
            navigate("/signin")
        }
    }, [auth])
    
    return (
        <>
            { auth && (
                <Outlet />
            )}
        </>
    )
}

export default PersistLogin
