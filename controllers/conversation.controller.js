const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const conversationHelper = require('../helper/conversation.helper')
const ErrorResponse = require('../utilis/errorResponse')
const {Conversation, conversationType, messageType} = require("../entities/conversation.model");
const httpStatus = require("http-status");
const {User, userRoles} = require("../entities/user.model");
const {ObjectId} = require("mongodb");


const createConversation = asyncHandler(async (req, res) => {
    let  { userIds, messageType, chatName, photoUrl, type } = req.body;

    if (messageType == 1 || messageType < 1 || messageType > 5)  throw new ErrorResponse(httpStatus.BAD_REQUEST, 'MessageType can be only 2, 3 or 4')

    if (messageType == 2 || messageType == 3){
        if (userIds.count != 1){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you must select only one person')
        }
        if (photoUrl != null || photoUrl != ""){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you cant select photo')
        }
        if (chatName != null || chatName != ""){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you cant select chatName')
        }
    }

    if (messageType == 2 || messageType == 3)
    {
        var receiverInfo  = await User.findOne({ _id: userIds[0] })
            .select("firstName lastName photoUrl")
            .lean();

        photoUrl = receiverInfo.photoUrl
        chatName = `${user.firstName} ${user.lastName}`
    }

    const newConversation = new Conversation({
        chatName : chatName,
        createdAt : Date.now(),
        userList : userIds,
        type : type,
        photoUrl : photoUrl,
        createrId : req.user.id
    },)

    await Conversation.create(newConversation);

    return res.send(httpStatus.OK).end()

})

const getConversation = asyncHandler(async (req, res) => {
    const userId = req.user.id

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
    var conversationId = new ObjectId(req.query.Id)

    var model = await Conversation.aggregate([
        {
            $match: conversationId
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
                message: "$messages.text",
                createdAt: "$messages.createdAt",
                senderName: { $concat: ["$senderInfo.firstName", " ", "$senderInfo.lastName"] },
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
