const mongoose = require('mongoose')
const {Schema} = require("mongoose");

const conversationType = {
    Open: 1,
    Private: 2,
    Group: 3,
    SuperPrivate: 4
}

const messageType = {
    Text: 1,
    MediaFile : 2
}

const conversationSchema = new mongoose.Schema(
    {
        chatName: {
            type: String,
        },
        status: {
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        type: {
            type: Number,
            enum: conversationType,
            default: conversationType.Private
        },
        photoUrl: String,
        createrId:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        userList:[{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        messages : [{
            type: {
                type: Number,
                enum: messageType,
                default: messageType.Text
            },
            value: {
                type: String,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            mentionMessageId: {
                type: Schema.Types.ObjectId,
                ref: 'messages'
            }
        }],
    }
)

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = { Conversation, conversationType, messageType }
