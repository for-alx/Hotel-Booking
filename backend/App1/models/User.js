import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { getHash } from "../utils/createToken.js"
import AddressSchema from "./Address.js"

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "please provide first name"]
    },
    lastName: {
        type: String,
        default: "Unknown"
    },
    middleName: {
        type: String,
        required: [true, "please provide middle name"]
    },
    address: {
        type: AddressSchema,
        default: {
            streetAddress: "Unknown",
            city: "Unknown",
            state: "Unknown",
            country: "Unknown"
        }
    },
    email: {
        type: String,
        unique: true,
        minlength: 6,
    },
    phone: {
        type: String,
        // unique: true
    },
    password: {
        type: String,
        // required: [true, "please provide password"],
        minlength: 6,
    },
    accountType: {
        type: String,
        enum: ["guest", "member", "manager", "receptionist"],
        default: "guest"
    },
    isVerified: {
        type: Boolean,
        require: true,
        default: false
    },
    verificationToken: {
        type: String
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    verified: {
        type: Date
    }
}, {timestamps: true})

UserSchema.pre("save", async function() {
    if(!this.isModified("password")) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

UserSchema.methods.compareResetToken = async function (canditatePassword) {
    const isMatch = this.resetToken = getHash(canditatePassword)
    return isMatch
}
const User = mongoose.model("User", UserSchema)

export default User
