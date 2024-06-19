const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    files: {
        type: [{
            name: {
                type: String,
                required: true
            },
            data: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            sender: {
                type: String,
                required: false
            },
            type: {
                type: String,
                required: true
            },
            isViewable: {
                type: Number,
                required: true
            },
            extension: {
                type: String,
                required: true
            },
            binNumber: {
                type: Number,
                required: true
                // 0 - My Files
                // 1 - Inbox
                // 2 - Recycling (From My files)
                // 3 - Recycling (From Inbox)
            }
        }]
    }
});

module.exports = mongoose.model('User', userSchema);