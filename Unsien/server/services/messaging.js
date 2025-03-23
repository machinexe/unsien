// messaging.service.js
class MessagingService {
    constructor(io) {
        this.io = io;
        this.onlineUsers = new Map();
    }

    initializeSocketListeners() {
        this.io.on("connection", (socket) => {
            this.handleSocketConnection(socket);
        });
    }

    handleSocketConnection(socket) {
        this.onlineUsers.set(socket.userId, socket.id);

        socket.on("send-msg", (data) => {
            this.handleSendMessage(data);
        });

        socket.on("disconnect", () => {
            this.handleSocketDisconnect(socket.userId);
        });
    }

    handleSendMessage(data) {
        const sendUserSocket = this.onlineUsers.get(data.to);
        if (sendUserSocket) {
            this.io.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    }

    handleSocketDisconnect(userId) {
        this.onlineUsers.delete(userId);
    }
}

module.exports = MessagingService;