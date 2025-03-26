const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
