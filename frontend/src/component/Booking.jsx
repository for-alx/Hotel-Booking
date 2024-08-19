import { useState } from "react"
import { axiosPrivate } from "../api/axios"
import useLocalState from "../hook/LocalState"
import Alert from "./admin/Alert"

import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const Booking = () => {
    const { alert, showAlert } = useLocalState()
    const bookingInfo = JSON.parse(localStorage.getItem("bookingInfo"))
    const roomDetail = JSON.parse(localStorage.getItem("roomDetail"))

    const [formData, setFormData] = useState({
        checkInDate: bookingInfo.checkInDate,
        checkOutDate: bookingInfo.checkOutDate,
        numberOfAdult: bookingInfo.numberOfAdult || 1,
        numberOfChild: bookingInfo.numberOfChild || 0,
        roomType: roomDetail?.availableRoom[0].style,
        room: roomDetail?.availableRoom[0]
    })

    const changeHandler = (e) => {
        if (e.target.name === "roomType") {
            let room = roomDetail?.availableRoom?.filter((room) => {
                return room.style === e.target.value
            })

            setFormData(prev => {
                return { ...prev, [e.target.name]: e.target.value, room: room}
            })
        } else {
            setFormData(prev => {
                return { ...prev, [e.target.name]: e.target.value}
            })
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axiosPrivate.post(`/book/create/${ (formData.room[0] !== undefined) ? formData.room[0]._id : roomDetail?.availableRoom[0]._id}`, formData)
        .then(res => {
            console.log(res?.data)
            showAlert({ msg: res?.data?.msg, type: "success", dismiss: 1000 })
            window.location.href = res.data?.data?.paymentURL
            // setTimeout(() => {
            //     navigate("/verify")
            // }, 5000)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "warning" })
        })
    }
    
    return (
        <>
            <Container>
                <Alert alert={alert} />
                <div className="booking-info pt-sm-3">
                    <h2 className="h3">Booking Info</h2>
                    <div className="pricing-info text-end">
                        <h3 className="text-success h5">Total price ${ (formData.room[0] !== undefined) ? formData.room[0].bookingPrice : roomDetail?.availableRoom[0].bookingPrice }</h3>
                    </div>
                    <Form onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label>Adult</Form.Label>
                            <Form.Control type="number" value={formData.numberOfAdult} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Children</Form.Label>
                            <Form.Control type="number" value={formData.numberOfChild} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Check In</Form.Label>
                            <Form.Control type="date" value={new Date(formData.checkInDate).toISOString().split('T')[0]} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Check Out</Form.Label>
                            <Form.Control type="date" value={new Date(formData.checkOutDate).toISOString().split('T')[0]} disabled/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Room Type</Form.Label>
                            <Form.Select
                                name="roomType"
                                type="text"
                                value={formData.roomType}
                                onChange={changeHandler}
                            >
                                { roomDetail.availableStyles && 
                                    roomDetail.availableStyles.map((style) => (
                                        <option key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                        <Button className="mt-3" type="submit">Add Booking</Button>
                        
                    </Form>
                </div>
            </Container>
        </>
    )
}

export default Booking
