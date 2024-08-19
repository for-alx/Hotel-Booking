import { useEffect, useState } from "react"
import { axiosPrivate } from "../../api/axios"
import useLocalState from "../../hook/LocalState"
import Alert from "./Alert"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Table from "react-bootstrap/Table"

const Dashboard = () => {
    const { showAlert, alert, hideAlert } = useLocalState()
    const [latestBookings, setLatestBookings] = useState()
    const [show, setShow] = useState({
        addRoom: false,
        addUser: false
    })
    const [newUserData, setNewUserData] = useState({
        firstName: "",
        middleName: "",
        email: "",
        phone: "",
        password: "",
        rePassword: "",
        accountType: ""
    })
    const [newRoomData, setNewRoomData] = useState({
        hotelLocation: "",
        roomNumber: "",
        style: "standard",
        bookingPrice: "",
        isSmoking: false
    })

    const [hotelLocation, setHotelLocation] = useState(null)

    const changeHandler = (e) => {
        setNewUserData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const changeHandler2 = (e) => {
        setNewRoomData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const handleShow =  {
        addRoom: () => {
            if(!hotelLocation) {
                axiosPrivate.get("/room/branch/getall")
                .then(res => {
                    setHotelLocation(res?.data?.data)
                })
                .catch(err => {
                    console.log(err)
                })
            }
            setShow({ addRoom: true, addUser: false })
        },
        addUser: () => {
            setShow({ addRoom: false, addUser: true })
        }
    }
    const handleClose = () => {
        setShow({
        addRoom: false,
        addUser: false
        })
        setNewRoomData({ hotelLocation: "", roomNumber: "", style: "standard", bookingPrice: "", isSmoking: false })
        setNewUserData({ firstName: "", middleName: "", email: "", phone: "", password: "", rePassword: "", accountType: "" })
    }

    const addUserHandler = (e) => {
        e.preventDefault()
        axiosPrivate.post("/auth/createUser", newUserData)
        .then(res => {
            showAlert({ msg: res?.data?.msg, type: "success" })
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }
    
    const addRoomHandler = (e) => {
        e.preventDefault()
        console.log("Debug: ", newRoomData)
        axiosPrivate.post("/room/create", newRoomData)
        .then(res => {
            showAlert({ msg: res?.data?.msg, type: "success" })
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }

    const getLatestBookings = () => {
        axiosPrivate.get("/book/latestBookings")
        .then(res => {
            setLatestBookings(res?.data?.data)
        })
        .catch(err => {
            showAlert({ msg: "can able to fetch data", type: "warning" })
        })
        //Update lates bookings every 5(300000) minuets
    }

    useEffect(() => {
        hideAlert()
        getLatestBookings()
    }, [])

    return (
        <>
            <Alert alert={alert} />
            <header className="py-2 bg-warning text-white">
                <Container>
                    <Row>
                        <Col md={6}>
                            <h1><i className="fa fa-gear"></i> Dashboard</h1>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* <!-- Content Area --> */}
            <section>
                <Container className="my-3">
                    <Row className="row align-items-end">
                        <Col md={3} className="m-1 d-grid">
                            <Button variant="primary" onClick={ handleShow.addUser }><i className="fa fa-plus"></i> Add User</Button>
                        </Col>
                        <Col md={3} className=" m-1 d-grid">
                            <Button variant="primary" onClick={ handleShow.addRoom }><i className="fa fa-plus"></i> Add Room</Button>
                        </Col>
                        <Col md={3} className="m-1 d-grid">
                            <Button variant="primary"><i className="fa fa-plus"></i> Add Employee</Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section>
                <Container>
                    <h1>New Bookings</h1>
                    <Row>
                        <Col sm={9}>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Room No</th>
                                        <th>User</th>
                                        <th>Check in</th>
                                        <th>Duration</th>
                                        {/* <th></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    { latestBookings && 
                                        latestBookings.map((book) => (
                                            <tr key={book._id}>
                                                <td>{book.room.roomNumber }</td>
                                                <td>{book.user.firstName + " " + book.user.middleName}</td>
                                                <td><input type="date" value={book.checkIn?.split("T")[0]} id="" disabled/> </td>
                                                <td>{book.durationInDays}</td>
                                                {/* <td className="float-end">
                                                    <Button variant="success" onClick={ () => { handleShow.edit(book._id) } }>Edit</Button>
                                                    <Button variant="warning" className="text-white mx-2" onClick={ () => { handleShow.status(book._id) } }>Status</Button>
                                                </td> */}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Col>
                        <Col sm={3}>
                            <Card bg="danger" className="text-center mb-3 text-white">
                                <Card.Body className="h2"><i className="fa fa-book"></i> 19</Card.Body>
                            </Card>
                            <Card bg="danger" className="text-center mb-3 text-white">
                                <Card.Body className="h2"><i className="fa fa-user"></i> 14</Card.Body>
                            </Card>
                            <Card bg="danger" className="text-center mb-3 text-white">
                                <Card.Body className="h2"><i className="fa"></i>Walla</Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/*  Add User Modals */}
            <Modal show={ show.addUser } onHide={ handleClose } className="round-3">
                <div className="p-3 bg-light">
                    <Modal.Header>
                        <Modal.Title>Add new user</Modal.Title>
                        <span onClick={ handleClose }>&times;</span>
                    </Modal.Header>

                    <Alert alert={alert} />

                    <Modal.Body>
                        <Form onSubmit={addUserHandler} action="">
                            <Row className="form-row">
                                <Col>
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={newUserData.firstName}
                                    onChange={changeHandler}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control
                                    type="text"
                                    name="middleName"
                                    value={newUserData.middleName}
                                    onChange={changeHandler}
                                    />
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                type="email"
                                name="email"
                                value={newUserData.email}
                                onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                type="phone"
                                name="phone"
                                value={newUserData.phone}
                                onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                type="password"
                                name="password"
                                value={newUserData.password}
                                onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control
                                type="rePassword"
                                name="rePassword"
                                value={newUserData.rePassword}
                                onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Account type</Form.Label>
                                <Form.Select
                                type="text"
                                name="accountType"
                                value={newUserData.accountType}
                                onChange={changeHandler}
                                >
                                    <option>Account Type...</option>
                                    <option>Member</option>
                                    <option>Guest</option>
                                    <option>Manager</option>
                                    <option>Receptionist</option>
                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-3"><i className="fa fa-save"></i> Save</Button>
                            
                        </Form>
                    </Modal.Body>

                </div>
            </Modal>

            {/* Add Room */}
            <Modal show={ show.addRoom } onHide={ handleClose }>
                <div className="modal-lg bg-light">
                    <Modal.Header>
                        <Modal.Title>Add new room</Modal.Title>
                        <span onClick={ handleClose }>&times;</span>
                    </Modal.Header>
                    
                    <Alert alert={alert} />

                    <Modal.Body>
                        <Form onSubmit={ addRoomHandler } action="">
                            <Form.Group>
                                <Form.Label>For branch</Form.Label>
                                <Form.Select
                                type="text"
                                name="hotelLocation"
                                value={ newRoomData.hotelLocation }
                                onChange={ changeHandler2 }
                                >
                                    <option>Choose Hotel Location</option>
                                    { hotelLocation && 
                                        hotelLocation.map((branch) => (
                                            <option key={ branch._id } value={ branch._id }>{ branch.name }</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Room number</Form.Label>
                                <Form.Control
                                type="text"
                                name="roomNumber"
                                value={ newRoomData.roomNumber }
                                onChange={ changeHandler2 }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Booking price</Form.Label>
                                <Form.Control
                                type="text"
                                name="bookingPrice"
                                value={ newRoomData.bookingPrice }
                                onChange={ changeHandler2 }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Style</Form.Label>
                                <Form.Select
                                type="text"
                                name="style"
                                value={ newRoomData.style }
                                onChange={ changeHandler2 }
                                >
                                    <option>Standard</option>
                                    <option>Deluxe</option>
                                    <option>Family</option>
                                    <option>Business</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="ml-4 my-3">
                                <Form.Check
                                label="Is smoking"
                                type="checkbox"
                                name="isSmoking"
                                value={ newRoomData.isSmoking }
                                onChange={ changeHandler2 }
                                />
                            </Form.Group>
                            
                            <Button variant="primary" type="submit"><i className="fa fa-plus"></i> Add</Button>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}

export default Dashboard
