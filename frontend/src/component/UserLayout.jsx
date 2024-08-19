import { Outlet } from "react-router-dom"

import Navbar2 from "./Navbar2"

const UserLayout = () => {
    return (
        <>
            <Navbar2 />
            <Outlet />
        </>
    )
}

export default UserLayout
