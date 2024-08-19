import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGlobalContext } from "../context/GlobalContext"
import useLocalState from "../hook/LocalState"
import { axiosPrivate } from "../api/axios"

import Alert from "./admin/Alert"
import DateRangePicker from "react-bootstrap-daterangepicker"
import "bootstrap-daterangepicker/daterangepicker.css"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"

const Home = () => {
    const { user } = useGlobalContext()
    const { alert, showAlert } = useLocalState()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        numberOfAdult: "",
        numberOfChild: "",
        checkInDate: "",
        checkOutDate: "",

    })

    const handleEvent = (event, picker) => {
        // console.log(picker.startDate)
    }

    const handleCallback = (start, end, label)  => {
        setFormData(prev => {
            return {
                ...prev,
                checkInDate: start._d.toLocaleString()?.split(",")[0],
                checkOutDate: end._d.toLocaleString()?.split(",")[0]
            }
        })
    }

    const changeHandler = (e) => {
        setFormData(prev => {
            return { ...prev, [e.target.name]: e.target.value}
        })
    }

    const checkAvailabilityHandler = (e) => {
        e.preventDefault()
        axiosPrivate.post("/book/checkAvailability", formData)
        .then(res => {
            console.log(res?.data)
            
            if (res?.data?.data?.availableRoom?.length > 0) {                
                localStorage.setItem("bookingInfo", JSON.stringify(formData))
                localStorage.setItem("roomDetail", JSON.stringify(res?.data?.data))
                showAlert({ msg: res?.data?.msg, type: "success" })
                navigate("/book")
            } else {
                showAlert({ msg: "Oops can't able to get free room try another day", type: "warning" })
            }
        })
        .catch(err => {
            // show some alert message
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }
    

    return (
        <>
            <div className="home py-5 shadow-lg" id="home">
                <Container>
                    <div className="jumbotron mb-5">
                        <h1 className="display-4 h1 text-light">Spend Your Night With Us!</h1>
                        <p className="lead text-light mb-md-4">Brand Hotel is one of the best hotel in the city.</p>
                        {/* <hr className="my-4 text-light"/> */}
                        {/* <p className="text-light">It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
                        { user ? (
                            <a className="btn btn-primary btn-lg" href="#rooms" role="button">See more</a>
                        ) : (
                            <a className="btn btn-primary btn-lg" href="/signin" role="button">Join us</a>
                        ) }
                        
                    </div>

                    <Alert alert={alert} />

                    <div className="checkAvailability d-flex rounded m-auto w-75 pt-1 bg-light p-1">
                        <div className="fieldContainer m-auto d-inline">
                            <Form onSubmit={checkAvailabilityHandler} action="">
                                <DateRangePicker onEvent={handleEvent} onCallback={handleCallback}>
                                    <input className="dateRange rounded py-3" />
                                </DateRangePicker>
                                <input
                                    className="py-3 rounded mx-sm-1" 
                                    type="number"
                                    name="numberOfAdult"
                                    value={formData.numberOfAdult}
                                    onChange={changeHandler}
                                    placeholder="Number of Adults" />
                                <input
                                    className="py-3 rounded"
                                    type="number"
                                    name="numberOfChild"
                                    value={formData.numberOfChild}
                                    onChange={changeHandler}
                                    placeholder="Number of Children" />
                                <button className="btn rounded btn-primary py-3 px-sm-5c" type="submit">Check</button>
                            </Form>
                        </div>
                    </div>
                    
                </Container>
            </div>

            <div className="rooms" id="rooms">
                <h2 className="text-center py-3 py-sm-4 h3">Our Rooms</h2>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6} lg={4}>
                            <div className="card shadow mb-4 m-auto" style={{width: 18+"rem"}}>
                                <img src="http://localhost:3000/images/room_double.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h4 className="card-title">Family</h4>
                                    <h5 className="card-subtitle text-muted  pb-2">$250</h5>
                                    <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </Col>

                        <Col md={6} lg={4}>
                            <div className="card shadow mb-4 m-auto" style={{width: 18+"rem"}}>
                                <img src="http://localhost:3000/images/room_single.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h4 className="card-title">Family</h4>
                                    <h5 className="card-subtitle text-muted pb-2">$250</h5>
                                    <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </Col>

                        <Col md={6} lg={4}>
                            <div className="card shadow mb-4 m-auto" style={{width: 18+"rem"}}>
                                <img src="http://localhost:3000/images/room_deluxe.jpg" className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h4 className="card-title">Family</h4>
                                    <h5 className="card-subtitle text-muted pb-2">$250</h5>
                                    <p className="card-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                                </div>
                            </div>
                        </Col>

                    </Row>

                </Container>
            </div>

            <div className="gallery">
                <Container>
                    <h2 className="text-center py-3 py-sm-4 h3">Our Gallery</h2>

                </Container>
            </div>

        </>
    )
}

export default Home
