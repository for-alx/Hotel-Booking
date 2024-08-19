/*
// ===============================================================================
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

    return request(options, (err, res) => {
        if (err) {
            throw new Error(err)
        }
        return res.body
    })
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

    return await request(options, (err, res) => {
        if (err) {
            // if network is not stable at payment time this will generate error and need to be
            // performed again to verification check
            throw new Error(err)
        }
        return res.body
    })
}

export { initiatePayment, verifyPayment }
*/
// ===============================================================================
// ===============================================================================
// ===============================================================================













// import request from "request-promise"
/*
// Not completed yet encrypt payment requests
const initiatePayment = async (amount, user, bookingId ) => {
    const options = {
        "method": "POST",
        "url": "https://api.chapa.co/v1/transaction/initialize",
        "headers": {
            "Authorization": `Bearer CHASECK_TEST-Ag3A2p7ENjlUATWyRBHgpC5LmevIjRnv`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "amount": `${amount}`,
            "currency": "ETB",
            "email": `${user.email}`,
            "first_name": `${user.firstName}`,
            "last_name": `${user.middleName}`,
            "phone_number": `${user.phone}`,
            "tx_ref": `${bookingId}`,
            "callback_url": `http://localhost:5000/verifyPayment/${bookingId}`,
            "return_url": "http://localhost:3000/",
            "customization[title]": "Brand",
            "customization[description]": "Payment for brand room booking"
        })
    }
    // `http://localhost:3000/bookingReceipt/${bookingId}`

    return await request(options, (err, res) => {
        if (err) {
            throw new Error(err)
        }
        return res.body
    })
}

const verifyPayment = async (bookingId) => {
    const options = {
        "method": "GET",
        "url": `https://api.chapa.co/v1/transaction/verify/${bookingId}`,
        "headers": {
            "Authorization": `Bearer CHASECK_TEST-Ag3A2p7ENjlUATWyRBHgpC5LmevIjRnv`,
        },
        "redirect": "follow",
    }

    return await request(options, (err, res) => {
        if (err) throw new Error(err)
        return res.body
    })
}

async function main() {
  // initiatePayment(
  //   "100",
  //   {email: "test@gmail.com", firstName: "test", middleName: "test2", phone: "0909090909"},
  //   "24578ertyui45678tygh8"
  // ).then(res => {
  //   console.log(JSON.parse(res))
  // }).catch(err => {
  //   console.log(err)
  // })

  // try {
  //   await initiatePayment(
  //     "100",
  //     {email: "test@gmail.com", firstName: "test", middleName: "test2", phone: "0909090909"},
  //     "24578ertyui45678tygh8"
  //   )
  // } catch (e) {
  //   console.log("Error=============");
  // }

  verifyPayment("24578ertyui45678tygh")
  .then(res => {
    console.log(JSON.parse(res))
  })
  .catch(err => {
    console.log(err?.error)
  })
}

main()
*/


import request from "request"

const test = async () => {
    const options = {
      "method": "GET",
      "url": `https://ggggoogle.com`,
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

const main = async () => {
    try {
        console.log(await test())
    } catch (err) {
        console.log("Cached: ",);

    }
}
main()
