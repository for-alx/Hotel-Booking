import { useState, useEffect } from "react"
import { axiosPrivate } from "../../api/axios"
import useLocalState from "../../hook/LocalState"
import Alert from "../admin/Alert"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import Modal from "react-bootstrap/Modal"


const Room = () => {
    const { showAlert, alert } = useLocalState()
    const [data, setData] = useState()
    const [formData, setFormData] = useState({
        roomNumber: "",
        style: "",
        bookingPrice: "",
        status: "",
        isSmoking: ""
    })
    const [show, setShow] = useState({
        edit: false,
        status: false,
        currentRoomId: null,
        currentRoom: null
    }) 

    const handleShow =  {
        edit: (roomId) => {
            const room = data.find((room) => {
                return room._id === roomId
            })

            setFormData({
                roomNumber: room.roomNumber,
                style: room.style,
                bookingPrice: room.bookingPrice,
                status: room.status,
                isSmoking: room.isSmoking
            })

            setShow({ edit: true, status: false, currentRoomId: roomId, currentRoom: room })
        },
        status: (roomId) => {
            setShow({ edit: false, status: true, currentRoomId: roomId })
        }
    }
    const handleClose = () => setShow({
        edit: false,
        status: false,
        currentRoomId: null
    })

    const getRooms = async () => {
        axiosPrivate.get("/room/getall")
        .then(res => {
            setData(res?.data?.data?.allRooms)
        })
        .catch(err => {
            console.log(err?.response);
        })
    }

    const getSingleRoom = (roomId) => {
        axiosPrivate.get(`/room/${show.currentRoomId}`)
        .then(res => {
            setData(prev => {
                const newData = prev.map((room) => {
                    if (room._id === show.currentRoomId) {
                        return res?.data?.data
                    }
                    return room
                })
                setData(newData)
            })
        })
        .catch(err => {
            console.log(err?.response)
        })
    }

    const changeStatus = (e) => {
        e.preventDefault()
        axiosPrivate.post(`/room/changeStatus/${show.currentRoomId}`, {status: formData.status })
        .then(res => {
            showAlert({ msg: res?.data?.msg, type: "success" })
            getSingleRoom(show.currentRoomId)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }

    const editRoom = (action) => {
        // action can be "edit" and "delete"
        if (action === "edit") {
            console.log("Debug: ", formData)
            axiosPrivate.post(`/room/edit/${show.currentRoomId}`, formData)
            .then(res => {
                showAlert({ msg: res?.data?.msg, type: "success" })
                getSingleRoom(show.currentRoomId)
            })
            .catch(err => {
                showAlert({ msg: err?.response?.data?.msg, type: "danger" })
            })
        } else if(action === "delete") {
            showAlert({ msg: "Back-End not implemented yet", type: "warning" })
        } else {
            showAlert({ msg: "Something went wrong", type: "danger" })
        }
    }

    const changeHandler = (e) => {
        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    useEffect(() => {
        getRooms()
    }, [])
    
    return (
        <>
            <header className="py-2 bg-success text-white">
                <Container>
                    <Row>
                        <Col md={6}>
                            <h1><i className="fa fa-home"></i> Rooms</h1>
                        </Col>
                        <Col md={6}>
                            <Form className="mt-2">
                                <Row className="justify-content-end">
                                    <Col sm="auto">
                                        <Form.Control type="text" placeholder="Search"></Form.Control>
                                    </Col>
                                    <Col sm="auto">
                                        <Button type="submit">Search</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* <!-- Content Area --> */}
            <section>
                <Container>
                <h1>Rooms List</h1>
                <Row>
                    <Col sm={12}>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Room No</th>
                                    <th>Price</th>
                                    <th>Style</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { data && 
                                    data.map((room) => (
                                        <tr key={room._id}>
                                            <td>{room.roomNumber}</td>
                                            <td>${room.bookingPrice}</td>
                                            <td>{room.style}</td>
                                            <td>{room.status}</td>
                                            <td className="float-end">
                                                <Button variant="success" onClick={ () => { handleShow.edit(room._id) } }>Edit</Button>
                                                <Button variant="warning" className="text-white mx-2" onClick={ () => { handleShow.status(room._id) } }>Status</Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Col>
                    <Col className="text-white">
                    
                    </Col>
                </Row>
                </Container>
            </section>

            {/* <!-- Modals --> */}
            <Modal show={show.edit} onHide={handleClose}>
                <div className="modal-lg bg-light">
                    <Modal.Header>
                        <Modal.Title>Edit room</Modal.Title>
                        <span className="ml-auto" onClick={ handleClose }>&times;</span>
                    </Modal.Header>

                    <Alert alert={alert} />

                    <Modal.Body>
                        <Form onSubmit={ editRoom } method="post">
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                type="text"
                                name="status"
                                value={formData.status}
                                onChange={changeHandler}>
                                    <option>Available</option>
                                    <option>Reserved</option>
                                    <option>Occupied</option>
                                    <option>Being Serviced</option>
                                    <option>Other</option>
                                </Form.Select>
                            </Form.Group>
                            <hr/>
                            <Form.Group>
                                <Form.Label>Room number</Form.Label>
                                <Form.Control
                                type="number"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Booking price</Form.Label>
                                <Form.Control
                                type="text"
                                name="bookingPrice"
                                value={formData.bookingPrice}
                                onChange={changeHandler}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Style</Form.Label>
                                <Form.Select
                                type="text"
                                name="style"
                                value={formData.style}
                                onChange={changeHandler}>
                                <option>Standard</option>
                                <option>Deluxe</option>
                                <option>Family</option>
                                <option>Business</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Check
                            className="my-2"
                            name="isSmoking"
                            type="checkbox"
                            label="Is smoking"
                            value={formData.isSmoking}
                            onChange={changeHandler}
                            />

                            <div className="d-inline">
                                <Button variant="primary" onClick={ () => { editRoom("edit") }} ><i className="fa fa-save"></i> Save</Button>
                                <Button variant="danger" className="float-end" onClick={ () => { editRoom("delete") } } ><i className="fa fa-remove"></i> Delete</Button>
                            </div>
                        </Form>
                    </Modal.Body>

                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={show.status} onHide={handleClose}>
                <div className="modal-lg bg-light">
                    <Modal.Header>
                        <Modal.Title>Update Status</Modal.Title>
                        <span onClick={handleClose}>&times;</span>
                    </Modal.Header>
                    
                    <Alert alert={alert} />

                    <Modal.Body>
                        <Form onSubmit={ changeStatus } method="post">
                            <div className="form-group">
                                <label htmlFor="">Status</label>
                                <Form.Select type="text" name="status" value={ formData.status } onChange={ changeHandler }>
                                    <option>Available</option>
                                    <option>Reserved</option>
                                    <option>Occupied</option>
                                    <option>Being Serviced</option>
                                    <option>Other</option>
                                </Form.Select>
                            </div>
                            <hr/>
                            <Button variant="primary" type="submit"><i className="fa fa-save"></i> Save</Button>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}

export default Room
