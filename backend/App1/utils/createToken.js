import crypto from "crypto"

const getVerificationToken = () => {
    return crypto.randomBytes(3).toString('hex')
}

const getRefreshToken = () => {
    return crypto.randomBytes(30).toString('hex')
}

const getUserToken = (user) => {
    return { firstName: user.firstName, middleName: user.middleName, email: user.email, phone: user.phone, userId: user._id, role: user.accountType}
}

const getResetPassword = () => {
    return crypto.randomBytes(4).toString('hex')
}

const getHash = (string) => {
    return crypto.createHash("md5").update(string).digest("hex")
}

export {
    getVerificationToken,
    getRefreshToken,
    getUserToken,
    getResetPassword,
    getHash
}