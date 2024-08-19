import Container from "react-bootstrap/Container"

const Booking = (probs) => {
    console.log("Booking: ", probs)
    
    return (
        <>
            <Container>
                <div className="booking-info text-center">
                    <h2 className="h3">Booking Info</h2>
                </div>
            </Container>
        </>
    )
}

export default Booking
