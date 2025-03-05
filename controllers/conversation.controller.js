const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const conversationHelper = require('../helper/conversation.helper')
const ErrorResponse = require('../utilis/errorResponse')
const {Conversation, conversationType, messageType} = require("../entities/conversation.model");
const httpStatus = require("http-status");
const {User, userRoles} = require("../entities/user.model");
const {ObjectId} = require("mongodb");


const createConversation = asyncHandler(async (req, res) => {
    let  { userIds, conversationType, chatName, photoUrl } = req.body;

    if (conversationType == 2 || conversationType == 3)
    {
        var receiverInfo  = await User.findOne({ _id: userIds[0] })
            .select("firstName lastName photoUrl")
            .lean();

        photoUrl = receiverInfo.photoUrl
        chatName = `${receiverInfo.firstName} ${receiverInfo.lastName}`
    }

    const newConversation = new Conversation({
        chatName : chatName,
        createdAt : Date.now(),
        userList : userIds,
        type : conversationType,
        photoUrl : photoUrl,
        createrId : req.user.sub
    },)

    await Conversation.create(newConversation);

    return res.send(httpStatus.OK).end()

})

const getConversation = asyncHandler(async (req, res) => {
    const userId = req.user.sub

    var model = await Conversation.aggregate([
        {
            $match: { userList: new ObjectId(userId) }
        },
        {
            $project: {
                id: '$_id',
                createdAt: 1,
                photoUrl: 1,
                Type: 1,
                lastMessageTime: { $arrayElemAt: ["$messages.createdAt", -1] },
                lastMessage: { $arrayElemAt: ["$messages.value", -1] },
                chatName: 1,
            }
        },
        {
            $sort:{
                lastMessageTime: -1,
                cratedAt: -1
            }
        }
        ]
    ).exec();

    return res.status(400).json(model).end()
})

const getConversationMessages = asyncHandler( async (req,  res) => {
    var conversationId = req.query.conversationId

    var model = await Conversation.aggregate([
        {
            $match: { _id: new ObjectId(conversationId) }
        },
        {
            $unwind: "$messages"
        },
        {
            $lookup: {
                from: "users",
                localField: "messages.senderId",
                foreignField: "_id",
                as: "senderInfo"
            }
        },
        {
            $unwind: "$senderInfo"
        },
        {
            $project: {
                _id: 0,
                message: "$messages.value",
                createdAt: "$messages.createdAt",
                senderName: { $concat: ["$senderInfo.firstName"] },
                mentionId: "$messages.mentionId",
                Type:1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]).exec()

    return res.status(400).json(model).end()
})

const createMessage = asyncHandler(
    async (req, res) => {
    const  {text, messageType, mentionMessageId, conversationId } = req.body;
    const senderId = req.user.sub;

    const newMessage = {
        type: messageType,
        value: text,
        createdAt: new Date(),
        mentionMessageId : mentionMessageId,
        senderId: senderId,
    };

    await Conversation.updateOne(
        { _id: conversationId },
        { $push: { messages: newMessage } }
    ).exec();

    return res.status(400).end()
})

module.exports = {createConversation, getConversation, getConversationMessages, createMessage }
