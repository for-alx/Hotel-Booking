import { Outlet } from "react-router-dom"
import Navbar from "./NavbarC"
import Footer from "./Footer"

const AdminLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}

export default AdminLayout
