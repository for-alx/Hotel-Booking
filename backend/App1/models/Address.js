import mongoose from "mongoose"

const AddressSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: [true, "Please provide street address"]
    },
    city: {
        type: String,
        required: [true, "please provide city"]
    },
    state: {
        type: String,
        required: [true, "please provide state"]
    },
    country: {
        type: String,
        required: [true, "please provide country"]
    }
})

export default AddressSchema
