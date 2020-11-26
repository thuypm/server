const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username:{
        type: String,
        required: true
    },
    roomList:{
    type: Array,

    },
    password:{
        type: String,
        required: true
    },

    avatar: {
        type: String,
    },
    notification: Array,
});

module.exports = mongoose.model('user', User);