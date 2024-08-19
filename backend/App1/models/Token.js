import mongoose from "mongoose"

const TokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
    // Add more info about active session
}, {timestamps: true})

const Token = mongoose.model("Token", TokenSchema)

export default Token
