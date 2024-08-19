import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
        required: true,
        unique: true
    },
    price: {
        type: mongoose.Decimal128,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled"],
        default: "pending"
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    confirmationDate: {
        type: Date,
        default: null
    },
    checkOutURL: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Payment = mongoose.model("Payment", PaymentSchema)

export default Payment
