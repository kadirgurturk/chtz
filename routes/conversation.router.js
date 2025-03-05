const express = require('express')
const router = express.Router()
const conversationController = require('../controllers/conversation.controller')

router.post("/createConversation", conversationController.createConversation)

router.get("/getConversations", conversationController.getConversation)

router.get("/getMessages", conversationController.getConversationMessages)

router.post("/createMessage", conversationController.createMessage)

module.exports = router

