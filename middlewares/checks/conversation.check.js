const Conversation = require('../../entities/conversation.model');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const checkConversationExists = asyncHandler(async (req, res, next) => {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
    }

    req.conversation = conversation;

    next();
});

module.exports = {checkConversationExists}
