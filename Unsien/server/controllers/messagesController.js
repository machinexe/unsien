const Messages = require("../model/messageModel");


module.exports.postMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        console.log('id in sendmsg: ', data._id);

        if (data) return res.json({ msg: "Message sent successfully.", messageId: data._id });
        else return res.json({ msg: "Failed to sent message to the database" });


    } catch (ex) {
        next(ex);
    }
};

module.exports.getMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.reduce((acc, msg) => {
            // Check if the current user (from) is in the deletedBy array
            if (!msg.deletedBy.includes(from)) {
                acc.push({
                    _id: msg._id,
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message.text,
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt,
                });
            }
            return acc;
        }, []);
        
        res.json(projectedMessages);

    } catch (ex) {
        next(ex);
    }
};

module.exports.clearChat1Side = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        // Find the message
        const messagesList = await Messages.find({
            users: { $all: [from, to] },
        });

        if (!messagesList) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Update each message by removing the current user from the 'users' array
        // Add the user to the 'deletedBy' array for each message
        for (const message of messagesList) {
            await Messages.findByIdAndUpdate(message._id, {
                $addToSet: { deletedBy: from },
            });
        }

        return res.status(200).json({ message: "Chat cleared successfully" });

    } catch (ex) {
        next(ex);
    }
};

module.exports.deleteMessage = async (req, res, next) => {
    try {
        console.log('id in deletemsg: ', req.body);

        const msg = req.body;
        const messageId = msg._id;

       // Find the message by the provided messageId
        const message = await Messages.findById(messageId);

        // Check if the message exists
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Update the message content to "Message was deleted"
        message.message.text = 'Message has been deleted.';

        // Save the updated message to the database
        await message.save();

        // Return a success response
        res.status(200).json({ message: 'Message deleted successfully' });


    } catch (ex) {
        next(ex);
    }
};