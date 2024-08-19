import jwt from "jsonwebtoken"
import config from "../config.js"

const signToken = ({ payload }) => {
    return jwt.sign(payload, config.JWT_SECRET)
}

const isTokenValid = (token) => {
    return jwt.verify(token, config.JWT_SECRET)
}

const attachCookies = ({ res, user, refreshToken}) => {
    const accessTokenJWT = signToken({ payload: { user } })
    const refreshTokenJWT = signToken({ payload: { user, refreshToken } })

    const oneDay = 86400000
    const oneMonth = 2592000000

    // res.cookie("accessToken", accessTokenJWT, {
    //     httpOnly: true,
    //     // sameSite: 'None',
    //     secure: false, // Set to true if your site is served over HTTPS
    //     signed: true,
    //     expires: new Date(Date.now() + oneDay)
    // })

    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        // sameSite: 'None',
        secure: false, // Set to true if your site is served over HTTPS
        signed: true,
        expires: new Date(Date.now() + oneMonth)
    })

    return { accessTokenJWT }
}

const removeCookies = (res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
}


export {
    signToken,
    isTokenValid,
    attachCookies,
    removeCookies
}


