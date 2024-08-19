import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useGlobalContext } from "../context/GlobalContext"
import useAxiosPrivate from "../hook/useAxiosPrivate"


const PersistLogin = () => {
    const { auth } = useGlobalContext()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController();
        axiosPrivate.get("/auth/me")
        .then(res => {
            console.log("Page refreshed with token")
        })
        .catch(err => {
            // Nothing to do
        })
        return () => {
            controller.abort()
        }
    }, [])
    
    return (
        <>
            { auth ? (
                <Outlet />
            ) : (
                navigate("/signin")
            ) }
        </>
    )

}

export default PersistLogin
