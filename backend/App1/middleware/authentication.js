import StatusCode from "http-status-codes"
import CustomAPIError from "../errors/index.js"
import Token from "../models/Token.js"
import { isTokenValid, attachCookies } from "../utils/index.js"
import { signToken } from "../utils/index.js"

const authenticateUser = async (req, res, next) => {
    const rawAccessToken = req.headers?.Authorization || req.headers?.authorization

    try {
        if (!rawAccessToken) {
            throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
        }

        if (!rawAccessToken?.startsWith("Bearer")) {
            throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
        }

        const token = rawAccessToken?.split(" ")[1]
        if (token) {
            const payload = isTokenValid(token)
            req.user = payload
            return next()
        } else {
            throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
        }
    } catch(err) {
        throw new CustomAPIError.UnauthenticatedError("Invalid authentication3")
    }

    // Old way
    // console.log("=======> Debugging from authentication middle ware: ", req.signedCookies)
    // const { refreshToken, accessToken } = req.signedCookies

    // try {
    //     if (accessToken) {
    //         const payload = isTokenValid(accessToken)
    //         req.user = payload.user
    //         return next()
    //     }
    
    //     if (refreshToken) {
    //         const payload = isTokenValid(refreshToken)
    //         const existingRefreshToken = await Token.findOne({ user: req.user.userId, refreshToken: refreshToken })
    
    //         if (!existingRefreshToken || !existingRefreshToken.isValid) {
    //             throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
    //         }
    //         attachCookies({ res, user: payload.user, refreshToken: existingRefreshToken.refreshToken })
    //         req.user = payload.user
    //         return next()
    //     } else {
    //         throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
    //     }
    // } catch(err) {
    //     throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
    // }
}

// Refresh
const refresh = async (req, res) => {
    const { refreshToken } = req.signedCookies

    if (refreshToken) {
        const payload = isTokenValid(refreshToken)

        if (!payload) {
            throw new CustomAPIError.UnauthorizedError("Invalid authentication")
        }

        const existingRefreshToken = await Token.findOne({ user: payload?.user?.userId, refreshToken: payload?.refreshToken })

        if (!existingRefreshToken || !existingRefreshToken.isValid) {
            throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
        }

        const newAccessToken = signToken({ payload: payload.user })
        res.status(StatusCode.OK).json({ success: true, msg: "new access token", data: { user: {...payload.user}}, accessToken: newAccessToken })
    } else {
        throw new CustomAPIError.UnauthenticatedError("Invalid authentication")
    }
}



// Role
const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.user.role)) {
            throw new CustomAPIError.UnauthorizedError("Unauthorized to access this resource")
        }
        next()
    }
}

export {
    authenticateUser,
    authorizePermission,
    refresh
}


