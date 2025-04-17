const { Server } = require("socket.io");
const Conversation = require('../entities/conversation.model');

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {

        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
            console.log(`🟢 Kullanıcı ${socket.id} sohbete katıldı: ${conversationId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { conversationId, senderId, message } = data;

            const conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return console.log('❌ Sohbet bulunamadı!');
            }

            const newMessage = {
                type: 1,
                value: message,
                senderId,
                createdAt: new Date(),
                mentionMessageId: null
            };

            conversation.messages.push(newMessage);
            await conversation.save();

            // Kullanıcılara mesajı gönder
            io.to(conversationId).emit('receiveMessage', {
                senderId,
                message,
                createdAt: newMessage.createdAt
            });
        });

        socket.on('disconnect', () => {
            console.log('Kullanıcı ayrıldı:', socket.id);
        });
    });

    return io;
};
