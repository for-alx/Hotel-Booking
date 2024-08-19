import StatusCode from "http-status-codes"
import CustomAPIError from "./customAPIError.js"

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCode.UNAUTHORIZED
    }
}

export default UnauthenticatedError
