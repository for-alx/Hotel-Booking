// Not integrated yet

import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const CustomerScheme = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "please provide first name"]
    },
    middleName: {
        type: String,
        required: [true, "please provide first name"]
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
    status: {
        type: String,
        enum: ["active", "closed", "canceled", "blackListed"]
    },
    reActivationToken: {
        type: String,   
    }
    
})

CustomerScheme.pre("save", async function() {
    if(!this.isModified("reActivationToken")) {
        return
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.reActivationToken, salt)
})

CustomerScheme.methods.comparesReActivationToken = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.reActivationToken)
    return isMatch
}

// const Customer = mongoose.model("Customer", CustomerScheme)

// export default Customer
