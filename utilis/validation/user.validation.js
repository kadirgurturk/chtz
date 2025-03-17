const Joi = require('joi')
const { passwordValidation } = require('./password.validation')

const registerValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required()
            .messages({
                'string.empty': 'email cannot be empty'
            }),
        password: passwordValidation,
        firstName: Joi.string().required()
            .messages({
                'string.empty': 'firstName cannot be empty'
            }),
        lastName: Joi.string().required()
            .messages({
                'string.empty': 'firstName cannot be empty'
            }),
    })}


const loginValidation = {
    body: Joi.object().keys({
        email: Joi.string().email().required()
            .messages({
                'string.empty': 'email cannot be empty'
            }),
        password: Joi.string().required()
            .messages({
                'string.empty': 'password cannot be empty'
            }),
    })
}

module.exports = { loginValidation, registerValidation}
