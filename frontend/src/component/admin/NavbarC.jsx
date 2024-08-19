import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Alert from './Alert'
import { useNavigate } from "react-router-dom"
import { useGlobalContext } from "../../context/GlobalContext"
import useLocalState from '../../hook/LocalState'
import { axiosPrivate } from '../../api/axios'


const NavbarC = () => {
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
            <Navbar className="nav-bar" expand="md" bg="dark" data-bs-theme="dark">
                <div className="container">
                <Navbar.Brand href="/" >Brand</Navbar.Brand>
                
                <Navbar.Toggle className=""></Navbar.Toggle>
                
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate("/admin/dashboard")}>Dashboard</Nav.Link>
                        <Nav.Link href="/index.html">Booking</Nav.Link>
                        <Nav.Link onClick={() => navigate("/admin/room")}>Rooms</Nav.Link>
                        <Nav.Link href="/index.html">Status</Nav.Link>
                    </Nav>

                    { user && (
                        <ul className="navbar-nav ml-auto">
                            <NavDropdown title={user.firstName} id="">
                                <NavDropdown.Item href="#"><i className="fa fa-user-circle"></i> Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#"><i className="fa fa-gear"></i> Settings</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link onClick={ onLogout }>Logout</Nav.Link>
                        </ul>
                    ) }
                </Navbar.Collapse>
                </div>
            </Navbar>
            <div className="nav-bar-divider"></div>

            <Alert alert={alert} />
        </>
    )
}
export default NavbarC
