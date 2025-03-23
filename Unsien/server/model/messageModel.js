const mongoose = require("mongoose");

// Creating msgs folder in mongoose Schema
const messageSchema = mongoose.Schema(
    {
        message: {
            text: { type: String, required: true },
        },
        users: Array,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Messages", messageSchema);