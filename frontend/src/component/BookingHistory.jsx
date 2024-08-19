import { useEffect, useState } from "react"
import { axiosPrivate } from "../api/axios"
import useLocalState from "../hook/LocalState"
import Alert from "./admin/Alert"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"


const BookingHistory = () => {
    const { alert, showAlert } = useLocalState()
    const [data, setDate] = useState([])
    useEffect(() => {
        // 
        axiosPrivate.get("/book/history")
        .then(res => {
            setDate(res.data.data)
            console.log(res.data.data)
        })
        .catch(err => {
            showAlert({ msg: err?.response?.data?.msg, type: "danger" })
        })
    }, [])
    return (
        <>
            <Alert alert={alert} />
            <Container className="mt-md-3">
                <h3 className="h4">Booking History Lists</h3>

                { data ? 
                    data.map((book) => (
                        <div className="booking-card border p-sm-4 p-2 mb-3 rounded">
                            <Row>
                                <Col>
                                    Booking Id
                                    <br/>
                                    Booking Date
                                    <br/>
                                    Payment Status
                                    <br/>
                                    Booming Status
                                </Col>
                                <Col>
                                    {book._id}
                                    <br/>
                                    {book.startDate}
                                    <br/>
                                    {book.status}
                                    <br/>
                                    Checked Out
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                <Button variant="primary" className="mx-sm-4 mx-3"><i className="fa fa-eye"/></Button>
                                <Button variant="success"><i className="fa fa-edit"/></Button>
                            </div>
                        </div>
                    ))
                 : (
                    <h1>walla</h1>
                )}
            </Container>
        </>
    )
}

export default BookingHistory
