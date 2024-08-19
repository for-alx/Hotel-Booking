class CustomAPIError extends Error {
    constructor(message) {
        super(message)
        this.errorType = "customAPIError"
    }
}

export default CustomAPIError
