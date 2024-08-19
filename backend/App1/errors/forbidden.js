import StatusCode from "http-status-codes"
import CustomAPIError from "./customAPIError.js"

class ForbiddenError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCode.FORBIDDEN
    }
}

export default ForbiddenError
