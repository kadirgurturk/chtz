class ErrorResponse extends Error {
    constructor (statusCode, title, message, stack = '') {
        super(message)
        this.statusCode = statusCode
        this.title = title
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports = ErrorResponse
