const express = require('express')
const router = express.Router()
const conversationController = require('../controllers/conversation.controller')
const conversationCheck = require('../middlewares/checks/conversation.check')
const validate = require('../middlewares/validate')
const conversationValidation = require('../utilis/validation/conversation.validation')

router.post("/createConversation", validate(conversationValidation.createConversation), conversationController.createConversation)

router.get("/getConversations", conversationController.getConversation)

router.get("/getMessages", validate(conversationValidation.getConversationMessages), conversationController.getConversationMessages)

router.post("/createMessage", validate(conversationValidation.createMessage), conversationController.createMessage)

router.get("/getChatsFooter", conversationController.getChatsFooter)

router.get("/getAllConversation", conversationController.getChatsFooter)

router.post("/updateGroupConversation",  conversationController.updateGroupConversation)

module.exports = router

