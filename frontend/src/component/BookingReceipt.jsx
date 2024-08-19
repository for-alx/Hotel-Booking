import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { axiosPrivate } from "../api/axios"
import Alert from "./admin/Alert"
import useLocalState from "../hook/LocalState"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Table from "react-bootstrap/Table"


const BookingReceipt = () => {
    const { alert, showAlert } = useLocalState()
    const [data, setData] = useState(null)
    const { bookingId } = useParams()
    useEffect(() => {
        axiosPrivate.get(`/book/bookingInfo/${bookingId}`)
        .then(res => {
            setData(res?.data?.data)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }, [])

    const printBookingReceipt = () => {
        console.log("Try to print specific div of the page")
    }

    return (
        <Container>
            
            <Alert alert={alert} />

            <Row className="mt-sm-3 px-sm-5 px-2 py-2">
                <Col xs={8} >
                    <h3 className="h4">Booking Receipt</h3>
                </Col>
                <Col className="text-end">
                    <a href="#" className="display-5" onClick={ printBookingReceipt }><i className="fa fa-print"></i></a>
                </Col>
            </Row>

            <div className="receipt-container px-sm-5 py-sm-3 border px-2 mb-md-3" id="receipt">
                <Row>
                    <Col>
                        {/* Brand */}
                        <a href="#" className="display-3" ><i className="fa fa-youtube"></i></a>
                    </Col>
                    <Col className="text-start">
                        <div className="d-flex justify-content-end">
                            <div>
                                Website: <a href="#">www.brand.com</a>
                                <br/>
                                Email: <a href="#">brandsupport@gmail.com</a>
                                <br/>
                                Phone: +251912131415
                                <br/>
                                Address: Amhara S-Wollo Dessie Arada
                            </div>
                        </div>
                    </Col>
                </Row>
                <hr/>
                { data ? (
                    <Row className="mb-5 mt-md-5">
                    <Col md={7}>
                        <h2 className="h5 pb-2">Personal Information</h2>
                        <Table borderless>
                            <tbody>
                                <tr>
                                    <td>First Name</td>
                                    <td>{data.user.firstName}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{data.user.middleName}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{data.user.phone || "Unknown"}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{data.user.email}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <h2 className="h5 pb-2">Booking Information</h2>
                        <Table className="border">
                            <tbody>
                                <tr>
                                    <td>Booking ID</td>
                                    <td>{data._id}</td>
                                </tr>
                                <tr>
                                    <td>Branch</td>
                                    <td>{data.room.hotelLocation?.name}</td>
                                </tr>
                                <tr>
                                    <td>Room No</td>
                                    <td>{data.room.roomNumber}</td>
                                </tr>
                                <tr>
                                    <td>Check In</td>
                                    <td>{data.checkIn.split("T")[0]}</td>
                                </tr>
                                <tr>
                                    <td>Check Out</td>
                                    <td>{data.checkOut.split("T")[0]}</td>
                                </tr>
                                <tr>
                                    <td>Appointment Date</td>
                                    <td>{data.startDate.split("T")[0]}</td>
                                </tr>
                            </tbody>
                        </Table>

                        <h2 className="h5 pb-2 pt-md-4">Payment Information</h2>
                        <Table className="border">
                            <tbody>
                                <tr>
                                    <td>Payment Status</td>
                                    <td className={ (data.status === "confirmed")  ? "text-success" : "text-warning" }>{data.status}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>${data.room.bookingPrice}</td>
                                </tr>
                                <tr>
                                    <td>Payment Time</td>
                                    <td>2024-12-12- 08:11:13</td>
                                </tr>
                                <tr>
                                    <td>Payment Method</td>
                                    <td>Chapa TeleBirr</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div>
                            QR Code
                        </div>
                    </Col>
                </Row>
                ) : (
                    <Row>
                        <h2 className="text-warning">Can't able to fetch data</h2>
                    </Row>
                )}
                <p className="text-danger">Note: This receipt is valid if and only if it's generated by the brand.com website.</p>
                <hr/>
                <div className="text-center py-md-4">
                    System developed and maintained by Beab Wuletaw
                </div>
            </div>
            
        </Container>
    )
}

export default BookingReceipt
