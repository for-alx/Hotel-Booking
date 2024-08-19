import StatusCode from "http-status-codes"
import CustomAPIError from "./customAPIError.js"

class BadRequest extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCode.BAD_REQUEST
    }
}

export default BadRequest
