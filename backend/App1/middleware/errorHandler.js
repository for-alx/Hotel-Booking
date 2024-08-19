import StatusCode from "http-status-codes"

const errorHandler = (err, req, res, next) => {
    const currentError = {
        msg: err.message || "Internal server Error please try again latter",
        statusCode: err.statusCode || StatusCode.INTERNAL_SERVER_ERROR
    }

    if (err.name === "ValidationError") {
        currentError.msg = Object.values(err.errors).map((value) => {
            return value.message
        }).join(", ")
        currentError.statusCode = StatusCode.BAD_REQUEST
    } else if(err.code === 11000) {
        currentError.msg = `Duplicated value entered for ${Object.keys(err.keyValue)}`
        currentError.statusCode = StatusCode.BAD_REQUEST
    } else if(err.errorType === "customAPIError") {
        // passed cause all error parameters are handled in custom error classes
        // console.log(err.name);
    } else if(err.name === "CastError") {
        if (err?.kind === "ObjectId") {
            currentError.msg = `Unsupported id for ${err?.model?.modelName}`
            currentError.statusCode = StatusCode.BAD_REQUEST
        } else {
            console.log("======= Unhandled mongoose casting error =======")      
        }
    } else {
        // Unknown error
        // log the error on the system log and return
        currentError.msg = "Internal server Error please try again latter"
        console.log("======= Unknown Error: ", err)
    }


    res.status(currentError.statusCode).json({ success: false, msg: currentError.msg })
}

export default errorHandler

