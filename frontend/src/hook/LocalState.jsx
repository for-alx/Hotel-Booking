import { useState } from "react"

const useLocalState = () => {
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        show: false,
        msg: "",
        type: "warning"
    })

    const showAlert = ({ msg, type = "warning", dismiss = 5000}) => {
        setAlert({ show: true, msg, type })

        setTimeout(() => {
            hideAlert()
        }, dismiss)
    }

    const hideAlert = () => {
        setAlert({ show: false, msg: "", type: "warning" })
    }

    return {
        alert,
        showAlert,
        hideAlert,
        loading,
        setLoading
    }
}

export default useLocalState
