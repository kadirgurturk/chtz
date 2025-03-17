const Joi = require('joi')

const createConversation = {
    body: Joi.object().keys({
        userIds: Joi.array().required().empty()
            .messages({
                'array.empty': 'userIds cannot be empty',
                'any.required': 'userIds is required',
            }),
        conversationType: Joi.number().max(1).required()
            .messages({
                'number.max': 'conversationType can only 1 or 0',
                'any.required': 'conversationType is required',
            })
    })
}

const getConversationMessages = {
    query: Joi.object().keys({
        conversationId: Joi.string().required()
            .messages({
                'string.empty': 'conversationId cannot be empty',
                'any.required': 'conversationId is required',
            })
    })
}

const createMessage = {
    body: Joi.object().keys({
        conversationId: Joi.string().required()
            .messages({
                'string.empty': 'conversationId cannot be empty',
                'any.required': 'conversationId is required',
            })
    })
}


module.exports = { createMessage, getConversationMessages, createConversation}
