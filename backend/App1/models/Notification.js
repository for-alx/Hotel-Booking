import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
    roomBooking: {
        type: mongoose.Schema.ObjectId,
        ref: "RoomBooking",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: [true, "please provide message to send"],
        maxlength: 200
    },
    type: {
        type: String,
        enum: ["email", "sms"],
        default: "sms"
    } 
}, {timestamps: true})

const Notification = mongoose.model("Notification", NotificationSchema)

export default Notification
