const mongoose = require("mongoose");

// Creating msgs folder in mongoose Schema
const sessionCipherSchema = mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    cipher: {
        type: mongoose.Schema.Types.Mixed, // Use mixed type to handle any data structure
        required: true,
    },
});

module.exports = mongoose.model("sessionCipher", sessionCipherSchema);
