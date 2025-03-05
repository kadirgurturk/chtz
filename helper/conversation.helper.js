const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const conversationHelper = require('../helper/conversation.helper')
const ErrorResponse = require('../utilis/errorResponse')
const {Conversation, conversationType, messageType} = require("../entities/conversation.model");
const httpStatus = require("http-status");
const {User, userRoles} = require("../entities/user.model");
const {ObjectId} = require("mongodb");


const CreateConversationCheck = async (conversationType, chatName, photoUrl, userIds) =>{

    if (conversationType == 1 || conversationType < 1 || conversationType > 5)  throw new ErrorResponse(httpStatus.BAD_REQUEST, 'MessageType can be only 2, 3 or 4')

    if (conversationType == 2 || conversationType == 4){

        if (userIds.length != 2){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you must select only one person')
        }
        if (photoUrl != undefined || photoUrl != "" || photoUrl != null){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you cant select photo')
        }
        if (chatName != undefined || chatName != ""){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you cant select chatName')
        }
    }

    var isUserIdsExists = await User.exists({
        _id: { $all: userIds }
    }).exec();

    if (!isUserIdsExists) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'userId not valid')


    if (conversationType == 2){

        var isConversationExists = await Conversation.exists({
            userIds: { $all: [...userIds] },
            ConversationType: 2
        }).exec();

        if (isConversationExists) throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you cant select chatName')
    }

    if (conversationType == 3){ //Group

        if (userIds.length != 1){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you have add at least one person')
        }
        if (chatName == undefined || chatName == ""){
            throw new ErrorResponse(httpStatus.BAD_REQUEST, 'you have to give your chat a name')
        }
    }


}
