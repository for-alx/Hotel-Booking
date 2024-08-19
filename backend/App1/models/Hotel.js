import mongoose from 'mongoose'

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "please provide hotel name"],
        maxlength: 50
    }
}, {timestamps: true})

const Hotel = mongoose.model('Hotel', HotelSchema)

export default Hotel

