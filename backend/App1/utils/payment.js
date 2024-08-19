// import request from "request-promise"
import request from "request"
import config from "../config.js"

// Not completed yet encrypt payment requests
const initiatePayment = async (amount, user, paymentId, bookingId ) => {    
    const options = {
        "method": "POST",
        "url": "https://api.chapa.co/v1/transaction/initialize",
        "headers": {
            "Authorization": `Bearer ${config.CHAPA_S_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "amount": `${amount}`,
            "currency": "ETB",
            "email": `${user.email || ""}`,
            "first_name": `${user.firstName || ""}`,
            "last_name": `${user.middleName || ""}`,
            // "phone_number": `${user.phone || ""}`,
            "tx_ref": `${paymentId}`,
            "callback_url": `http://localhost:5000/verifyPayment/${paymentId}`,
            "return_url": `http://localhost:3000/bookingReceipt/${bookingId}`,
            "customization[title]": "Brand",
            "customization[description]": "Payment for brand room booking"
        })
    }

    return new Promise((resolve, reject) => (
        request(options, (err, res) => {
            if (err) {
                return reject(new Error(err))
            }
            resolve(res.body)
        })
    ))
}

const verifyPayment = async (paymentId) => {
    const options = {
        "method": "GET",
        "url": `https://api.chapa.co/v1/transaction/verify/${paymentId}`,
        "headers": {
            "Authorization": `Bearer ${config.CHAPA_S_KEY}`,
        }, 
        "redirect": "follow",
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res) => {
            if (err) {
                return reject(new Error(err))
            }
            resolve(res.body)
        })
    })
}

export { initiatePayment, verifyPayment }
