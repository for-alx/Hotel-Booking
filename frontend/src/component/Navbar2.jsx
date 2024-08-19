import { useNavigate } from "react-router-dom"
import { axiosPrivate } from "../api/axios"
import { useGlobalContext } from "../context/GlobalContext"
import useLocalState from "../hook/LocalState"
import Alert from "./admin/Alert"

import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import NavDropdown from "react-bootstrap/NavDropdown"
import Nav from "react-bootstrap/Nav"


const Navbar2 = () => {
    const { user, setAuth, setUser } = useGlobalContext()
    const navigate = useNavigate()
    const { alert, showAlert, hideAlert } = useLocalState()


    const onLogout = () => {
        axiosPrivate.post("/auth/logout")
        .then(res => {
            setAuth(null)
            setUser(null)
            sessionStorage.clear()
            showAlert({ msg: `${res?.data?.msg} redirected to signin page...`, type: "success" })
            setTimeout(() => {
                hideAlert()
                navigate("/signin")
            }, 3000)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "warning" })
        })
    }
    return (
        <>
            <Navbar bg="light" expand="lg">
               <Container>
                    <Navbar.Brand href="/">Brand</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="m-auto"></Nav>
                        <Nav className="navbar-nav">
                            <Nav.Link className="mx-3" href="#">Home</Nav.Link>
                            <Nav.Link className="mx-3" href="#">Services</Nav.Link>
                            <Nav.Link className="mx-3" href="#">Gallery</Nav.Link>

                            { user && (
                                <ul className="navbar-nav ml-auto">
                                    <NavDropdown title={user.firstName} id="">
                                        <NavDropdown.Item href="/bookingHistory">Booking History</NavDropdown.Item>
                                        <NavDropdown.Item href="#">Booking Status</NavDropdown.Item>
                                        <NavDropdown.Item href="#">Change Booking</NavDropdown.Item>
                                        <NavDropdown.Item href="#"><i className="fa fa-user-circle"></i> Profile</NavDropdown.Item>
                                        <NavDropdown.Item href="#"><i className="fa fa-gear"></i> Settings</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        { (user?.role === "manager" || user?.role === "receptionist") && (
                                            <NavDropdown.Item href="/admin/dashboard">Admin</NavDropdown.Item>
                                        ) }
                                        <NavDropdown.Item href="#">Other</NavDropdown.Item>
                                        <NavDropdown.Item onClick={ onLogout }>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </ul>
                            ) }
                            <Nav.Link className="mx-3" href="#">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
               </Container>
            </Navbar>
            <Alert alert={alert} />
        </>
    )
}

export default Navbar2
