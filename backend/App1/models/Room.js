import mongoose from "mongoose"

const RoomSchema = new mongoose.Schema({
    hotelLocation: {
        type: mongoose.Schema.ObjectId,
        ref: "HotelLocation",
        required: true
    },
    roomNumber: {
        type: String,
        unique: true,
        required: [true, "please provide room no"]
    },
    style: {
        type: String,
        enum: ["standard", "deluxe", "family", "business"],
        default: "standard"
    },
    status: {
        type: String,
        enum: ["available", "reserved", "occupied", "notAvailable", "beingServiced", "other"],
        default: "available"
    },
    bookingPrice: {
        type: Number,
        required: [true, "please provide price"]
    },
    isSmoking: {
        type: Boolean,
        required: [true, "please provide smoking status"]
    }
}, {timestamps: true})

const Room = mongoose.model("Room", RoomSchema)

export default Room
