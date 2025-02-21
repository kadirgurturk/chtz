const mongoose = require('mongoose')
const ErrorResponse = require('../utilis/ErrorResponse')
const httpStatus = require('http-status')

const errorConverter = (err, req, res, next) => {
    let error = err
    if (!(error instanceof ErrorResponse)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
        const message = error.message || httpStatus[statusCode]
        error = new ErrorResponse(statusCode, message, false, err.stack)
    }
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode
        ? err.statusCode
        : 500

    res.status(statusCode)

    res.json(
        {
            title: err.title,
            description: err.message
        })
}

module.exports = { errorHandler, errorConverter }
