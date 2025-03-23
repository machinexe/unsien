const mongoose = require("mongoose");

// Creating msgs folder in mongoose Schema
const keyPairSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    identityKey: {
        pubKey: { type: mongoose.Schema.Types.Mixed, required: true },
        privKey: { type: mongoose.Schema.Types.Mixed, required: true },
    },
    registrationId: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("identityKeyPair", keyPairSchema);
