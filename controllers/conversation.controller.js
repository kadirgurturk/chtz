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

    return res.status(200).json(model).end()
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
                senderName: { $concat: ["$senderInfo.firstName", " ", "$senderInfo.lastName"] },
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

    return res.status(200).json(model).end()
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

    return res.status(200).end()
})

//Return User Currently Chats order by DATE
const getChats = asyncHandler(
    async (req, res) => {


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

        return res.status(200).end()
    })

//Return Last message
const getChatsFooter = asyncHandler(
    async (req, res) => {

        const conversationId = req.query.conversationId;
        const senderId = req.user.sub;

        const model = await Conversation.aggregate([
            {
                $match: { _id: new ObjectId(conversationId) }
            },
            {
                // sadece son mesajı almak için messages dizisinden son elemanı al
                $project: {
                    lastMessage: { $arrayElemAt: ["$messages", -1] } // sondan 1. eleman
                }
            },
            {
                $project: {
                    message: "$lastMessage.value",
                    createdAt: "$lastMessage.createdAt",
                    mentionId: "$lastMessage.mentionMessageId",
                    senderId: "$lastMessage.senderId",
                    isUserSend: {
                        $eq: ["$lastMessage.senderId", new ObjectId(senderId)]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "senderInfo"
                }
            },
            {
                $unwind: {
                    path: "$senderInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    message: 1,
                    createdAt: 1,
                    mentionId: 1,
                    isUserSend: 1,
                    senderName: {
                        $concat: ["$senderInfo.firstName", " ", "$senderInfo.lastName"]
                    }
                }
            }
        ]);

        return res.status(200).json(model).end()
    })

//Return all Conversation, filterType -> 0 = all, 1 = private, 2 = group
const getAllConversation = asyncHandler(
    async (req, res) => {

        const filterType = Number(req.query.filterType);
        const senderId = req.user.sub;

        const matchConditions = [
            { userList: new ObjectId(senderId) }
        ];

        if (filterType === 1) {
            matchConditions.push({ type: 1 });
        } else if (filterType === 2) {
            matchConditions.push({ type: 2 });
        }

        const model = await Conversation.aggregate([
            {
                $match: {
                    $and: matchConditions
                }
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ["$messages", -1] },
                    lastMessageCreatedAt: {
                        $ifNull: [{ $max: "$messages.createdAt" }, "$createdAt"]
                    }
                }
            },
            {
                $sort: {
                    lastMessageCreatedAt: -1,
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    chatName: 1,
                    photoUrl: 1,
                    type: 1,
                    lastMessage: {
                        value: "$lastMessage.value",
                        createdAt: "$lastMessage.createdAt"
                    }
                }
            }
        ]);

        return res.status(200).json(model).end();
    })

const updateGroupConversation = asyncHandler(async (req, res) => {
    const conversationId = req.query.id;
    const senderId = req.user.sub;

    const { chatName, photoUrl, status } = req.body;


    const conversation = await Conversation.findOne({
        _id: conversationId,
        type: conversationType.Group
    });

    if (!conversation) {
        return res.status(404).json({ message: "Group conversation not found" });
    }


    if (conversation.createrId.toString() !== senderId) {
        return res.status(403).json({ message: "Only the creator can update this group" });
    }


    if (chatName !== undefined) conversation.chatName = chatName;
    if (photoUrl !== undefined) conversation.photoUrl = photoUrl;
    if (status !== undefined) conversation.status = status;

    await conversation.save();

    return res.status(200).json({ message: "Conversation updated", conversation });
});



module.exports = {createConversation, getConversation, getConversationMessages, createMessage, getChatsFooter, getAllConversation, updateGroupConversation,  }
