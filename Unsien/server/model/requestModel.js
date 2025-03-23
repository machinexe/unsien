const { v4: uuidv4 } = require('uuid');

const mongoose = require("mongoose");

// Creating request folder in mongoose Schema
const requestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    userFromID: {
        type: String,
        required: true,
        unique: false,
    },
    userToID: {
        type: String,
        required: true,
        unique: false,
    },
    title: {
        type: String,
        required: true,
        unique: false,
        min: 1,
        max: 20,
    },
    description: {
        type: String,
        required: true,
        unique: false,
        max: 50,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

});

module.exports = mongoose.model("Requests", requestSchema);