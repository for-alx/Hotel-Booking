import { useEffect } from "react"
import { axiosPrivate } from "../api/axios"
import { useGlobalContext } from "../context/GlobalContext"


const useAxiosPrivate = () => {
    const { auth, setAuth, setUser } = useGlobalContext()

    const getRefreshToken = async () => {
        axiosPrivate.get("/auth/refresh")
        .then(res => {
            setAuth(res?.data?.accessToken)
            sessionStorage.setItem("accessToken", res?.data?.accessToken)
            setUser(res?.data?.data?.user)
            sessionStorage.setItem("_user", JSON.stringify(res?.data?.data?.user))
        })
        .catch(err => {
            setAuth(null)
            setUser(null)
        })
    }

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                console.log("Debugging: intercepted url: ", config?.url, " with this token: ", auth)
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${auth}`
                }
                return config 
            }, 
            error => {
                return Promise.reject(error)
            }
        )
        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => {
                return response
            },
            async (error) => {
                const previousRequest = error?.config
                if (error?.response?.status === 401 && !previousRequest?.sent && previousRequest?.url !== "/auth/refresh") {
                    previousRequest.sent = true
                    await getRefreshToken()
                    previousRequest.headers["Authorization"] = `Bearer ${auth}`
                    return axiosPrivate(previousRequest)
                }
                return Promise.reject(error)
            }
        )
        console.log("Interceptor integrated successfully")
        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor)
            axiosPrivate.interceptors.response.eject(responseInterceptor)
        }
    }, [auth])

    return axiosPrivate
}

export default useAxiosPrivate
