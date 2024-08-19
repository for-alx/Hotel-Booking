import mongoose from "mongoose"

const RoomBookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: "Room",
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    durationInDays: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["requested", "pending", "confirmed", "checkedIn", "checkedOut", "canceled", "abandoned"],
        default: "requested"
    },
    checkIn: {
        type: Date,
        required: [true, "please provide check in date"]
    },
    checkOut: {
        type: Date,
        required: [Date, "please provide check out date"]
    }
}, {timestamps: true})

const RoomBooking = mongoose.model("RoomBooking", RoomBookingSchema)

export default RoomBooking