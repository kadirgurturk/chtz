const Joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)

const passwordValidation = joiPassword.string().required()
    .max(30)
    .min(8)
    .noWhiteSpaces()
    .messages({
        'string.empty': 'password cannot be empty',
        'string.min': 'password length must be at least 8 characters long',
        'string.max': 'password length must be less than 30 characters',
        'password.noWhiteSpaces': 'password should not contain white spaces'
    })

module.exports = { passwordValidation }
