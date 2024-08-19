import "express-async-errors"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import config from "./config.js"
import connectDB from "./db/connect.js"

// Middlewares
import errorHandler from "./middleware/errorHandler.js"
import credentials from "./middleware/credentials.js"

// Routers
import authRouter from "./routes/authRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import roomRouter from "./routes/roomRoutes.js"


// Application
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(morgan())
app.use(cookieParser(config.JWT_SECRET))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"))


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/book", bookingRouter)
app.use("/api/v1/room", roomRouter)

// =========================== Test route =========================
import RoomBooking from "./models/RoomBooking.js"
import Payment from "./models/Payment.js"
import { verifyPayment } from "./utils/payment.js"
app.get("/verifyPayment/:paymentId", async (req, res) => {
    // encryption key must set on Chapa to secure hook request 
    const { paymentId } = req.params
    if (!paymentId) {
        console.log("Payment verification fails: no booking id")
        return res.end()
    }
    
    const payment = await Payment.findById(paymentId)

    if (!payment) {
        console.log("Payment verification fails: payment not initialized yet")
        return res.end()
    }

    let isVerified
    try {
        isVerified = await verifyPayment(paymentId)
        isVerified = JSON.parse(isVerified)        
    } catch(err) {
        console.log("IMPORTANT:( Payment verification fails because of network error: ", err?.message)
        return res.end()
    }

    if(isVerified?.data?.status === "success") {
        const booking = await RoomBooking.findById(payment.booking)

        booking.status = "confirmed"
        payment.status = "confirmed"
        payment.confirmationDate = Date.now()

        await payment.save()
        await booking.save()

        console.log("====================================================================")
        console.log("=============================Payment completed=======================")
        return res.end()
    } else {
        console.log("Payment not completed with status: ", isVerified?.data?.status)
        return res.end()
    }
})

// =================================================================



app.use(errorHandler)
app.use("*", async (req, res) => {
    console.log("404 page reached");
    res.status(404).json({success: false, msg: "Page doesn't exist"})
})


const main = async () => {
    await connectDB(config.MONGODB_URL).then((result) => {
        console.log("connected to db successfully");
    }).catch((err) => {
        console.log(err);
    })

    app.listen(config.PORT, () => {
        console.log("server is listening over port 5000");
    })
}

main()
