const mongoose = require("mongoose");

// Creating user folder in mongoose Schema
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 50,
        unique: true,
    },
    role: {
        type: String,
        unique: false,
    },
    });

    module.exports = mongoose.model("Users", userSchema);


