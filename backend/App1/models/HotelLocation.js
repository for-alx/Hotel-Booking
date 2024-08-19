import mongoose from "mongoose"
import AddressSchema from "./Address.js"

const HotelLocationSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true
    },
    name: {
        type: String,
        required: [true, "please enter hotel location name"],
        maxlength: 50
    },
    location: {
        type: AddressSchema,
        required: [true, "please provide location"]
    }
}, {timestamps: true})

const HotelLocation = mongoose.model("HotelLocation", HotelLocationSchema)

export default HotelLocation
