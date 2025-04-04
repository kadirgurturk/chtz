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

const updateGroupConversationValidation = {
    body: Joi.object().keys({
        chatName: Joi.string()
            .min(3)
            .max(100)
            .messages({
                'string.base': 'chatName must be a string',
                'string.min': 'chatName must be at least 3 characters',
                'string.max': 'chatName must be at most 100 characters',
            }),

        photoUrl: Joi.string()
            .uri()
            .messages({
                'string.uri': 'photoUrl must be a valid URL',
            }),

        status: Joi.number()
            .valid(0, 1)
            .messages({
                'any.only': 'status must be either 0 (inactive) or 1 (active)',
                'number.base': 'status must be a number',
            })
    })
};


module.exports = { createMessage, getConversationMessages, createConversation, updateGroupConversationValidation}
