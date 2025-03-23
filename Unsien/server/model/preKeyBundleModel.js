const mongoose = require("mongoose");

// Creating msgs folder in mongoose Schema
const preKeyBundle = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    preKeyBundle: {
        type: mongoose.Schema.Types.Mixed, // Use mixed type to handle any data structure
        required: true,
    },
});

module.exports = mongoose.model("preKeyBundle", preKeyBundle);
