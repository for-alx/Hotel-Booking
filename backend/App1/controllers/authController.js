import StatusCode from "http-status-codes"
import CustomAPIError from "../errors/index.js"
import User from "../models/User.js"
import Token from "../models/Token.js"
import { getVerificationToken, getRefreshToken, attachCookies, getUserToken, removeCookies, getResetPassword, getHash } from "../utils/index.js"

const availableAccountTypes = ["member", "guest", "manager", "receptionist"]

const signUp = async (req, res) => {
    const {firstName, middleName, email, phone, password, rePassword } = req.body
    
    if ((!email && !phone) || !firstName || !middleName || !password || !rePassword) {
        throw new CustomAPIError.BadRequest("Please provide registration information properly")
    }

    if (password !== rePassword) {
        throw new CustomAPIError.BadRequest("Password doesn't match")
    }

    if (password.length < 8 ) {
        // check for character and number combination
        throw new CustomAPIError.BadRequest("Use strong password")
    }

    const emailAlreadyExist = await User.findOne({ email })

    if (emailAlreadyExist) {
        throw new CustomAPIError.BadRequest("Email already exists")
    }

    const verificationToken = getVerificationToken()

    const newUser = new User({
        firstName: firstName,
        middleName: middleName,
        email: email,
        phone: phone,
        password: password,
        verificationToken: verificationToken
    })


    res.cookie("email", email, {
        httpOnly: true,
        secure: false,  // must be true for production level app
        signed: true,
        expires: new Date(Date.now() + 600000)
    })

    res.cookie("phone", phone, {
        httpOnly: true,
        secure: false,  // must be true for production level app
        signed: true,
        expires: new Date(Date.now() + 600000)
    })

    await newUser.save()
    
    const verificationLink = `https://domain.com/api/v1/auth/verify?email=${email}&phone=${phone}&token=${verificationToken}`
    // Send verification token and verificationLink via email or phone
    
    res.status(StatusCode.OK).json({ 
        success: true,
        msg: "Check your email or phone for verification code",
        data: { tempToken: verificationToken }
    })

}

const verify = async (req, res) => {
    // try to - use link implementation instead
    //         - count number of attempts
    const { verificationToken } = req.body
    let emailOrPhone = req.signedCookies.phone || req.signedCookies.email

    if (!emailOrPhone || !verificationToken) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    let user
    if (req.signedCookies.phone) {
        user = await User.findOne({ phone: emailOrPhone })
    } else {
        user = await User.findOne({ email: emailOrPhone })
    }

    if (!user) {
        throw new CustomAPIError.UnauthorizedError("Account doesn't exist")
    }

    if (user.verificationToken !== verificationToken) {
        throw new CustomAPIError.UnauthorizedError("Verification failed")
    }

    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ""

    await user.save()

    res.cookie("phone", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.cookie("email", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCode.OK).json({ success: true,  msg: "Account verified successfully"})
}


const signIn = async (req, res) => {
    const { email, phone, password } = req.body

    if ((!email && !phone) || !password) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    let user

    if (phone) {
        user = await User.findOne({ phone: phone })
    } else {
        user = await User.findOne({ email: email })
    }

    if (!user) {
        throw new CustomAPIError.UnauthorizedError("Invalid credential")
    }

    if (!user.isVerified) {
        throw new CustomAPIError.UnauthorizedError("Verify your account")
    }

    const isPasswordCorrect = await user.comparePassword(String(password))

    if (!isPasswordCorrect) {
        throw new CustomAPIError.UnauthorizedError("Invalid credential")
    }

    const userToken = getUserToken(user)

    let refreshToken = ""

    const oldToken = await Token.findOne({ user: user._id })

    if (oldToken) {
        if (!oldToken.isValid) {
            throw new CustomAPIError.UnauthorizedError("Invalid credential")
        }
        refreshToken = oldToken.refreshToken
        const { accessTokenJWT } = attachCookies({ res, user: userToken, refreshToken })
        return res.status(StatusCode.OK).json({ success: true, msg: "signed in successfully", data: { user: {...userToken }, accessToken: accessTokenJWT } })
    }

    refreshToken = getRefreshToken()
    
    const newToken = new Token({
        refreshToken: refreshToken,
        user: user._id
    })
    await newToken.save()
    const { accessTokenJWT } = attachCookies({ res, user: userToken, refreshToken })
    return res.status(StatusCode.OK).json({ success: true, msg: "signed in successfully", data: {...userToken }, accessToken: accessTokenJWT })
}

const logout = async (req, res) => {
    // try to advance this step
    await Token.findOneAndDelete({ user: req.user.userI })


    removeCookies(res)
    res.status(StatusCode.OK).json({ success: true, msg: "logged out successfully" })
}


const forgetPassword = async (req, res) => {
    const { email, phone } = req.body
    
    if (!email && !phone) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }
    
    let user

    if (phone) {
        user = await User.findOne({ phone: phone })
    } else {
        user = await User.findOne({ email: email })
    }

    if (!user) {
        throw new CustomAPIError.UnauthorizedError("Account doesn't exist")
    }

    const resetToken = getResetPassword()
    
    // send reset password via email or sms

    user.resetTokenExpiration = new Date(Date.now() + 600000)
    user.resetToken = getHash(resetToken)

    await user.save()

    res.status(StatusCode.OK).json({ success: true, msg: "Check your email for reset password" })


}

const resetPassword = async (req, res) => {
    // try to - use link implementation instead
    //         - count number of attempts
    const { email, phone, resetToken, password, rePassword } = req.body

    if ((!email && !phone) || !resetToken || !password || !rePassword) {
        throw new CustomAPIError.BadRequest("Please provide information properly")
    }

    if (password !== rePassword) {
        throw new CustomAPIError.BadRequest("Password doesn't match")
    }

    if (password.length < 8 ) {
        // check for character and number combination
        throw new CustomAPIError.BadRequest("Use strong password")
    }

    let user

    if (phone) {
        user = await User.findOne({ phone: phone })
    } else {
        user = await User.findOne({ email: email })
    }

    if (!user) {
        throw new CustomAPIError.UnauthorizedError("Account doesn't exist")
    }

    const currentTime = new Date.now()

    if (user.compareResetToken(resetToken) && user.resetTokenExpiration > currentTime) {
        user.password = password
        user.resetToken = null
        user.resetTokenExpiration = null
        await user.save()

        res.status(StatusCode.OK).json({ success: true, msg: "Password changed successfully" })
    } else {
        throw new CustomAPIError.UnauthorizedError("Invalid reset attempt")
    }
}

// Must move to it's own userController file
const createUser = async (req, res) => {
    let {firstName, middleName, email, phone, password, rePassword, accountType } = req.body
    
    if ((!email && !phone) || !firstName || !middleName || !password || !rePassword || !accountType) {
        throw new CustomAPIError.BadRequest("Please provide registration information properly")
    }

    accountType = String(accountType).toLowerCase()
    if(!availableAccountTypes.includes(accountType)) {
        throw new CustomAPIError.BadRequest("Account doesn't exist")
    }

    if (password !== rePassword) {
        throw new CustomAPIError.BadRequest("Password doesn't match")
    }

    if (password.length < 8 ) {
        // check for character and number combination
        throw new CustomAPIError.BadRequest("Use strong password")
    }

    const emailAlreadyExist = await User.findOne({ $or: [{ email }, { phone }] })

    if (emailAlreadyExist) {
        throw new CustomAPIError.BadRequest("User already exists")
    }


    const newUser = new User({
        firstName: firstName,
        middleName: middleName,
        email: email,
        phone: phone,
        password: password,
        verificationToken: "",
        accountType: accountType,
        isVerified: true,
        verified: Date.now()
    })

    await newUser.save()
    
    res.status(StatusCode.OK).json({ 
        success: true,
        msg: "User created successfully",
        data: newUser.email
    })

}

const me = async (req, res) => {
    res.status(StatusCode.OK).json({ success: true, msg: "Password changed successfully",  data:{ user: req.user } })
}

export {
    signUp,
    verify,
    signIn,
    logout,
    forgetPassword,
    resetPassword,
    createUser,
    me
}

