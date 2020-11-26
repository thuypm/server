const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    name: String,
    owner: String,
    members: [String],
    message: Array,
    // message:[{
    //   sender: String,
    //   content: String,
    //   time: {
    //       type: Number,
    //       default: new Date()
    //     },
    //   type: String,
    // }],
    listEx: [],
    timeCreate: {
        type: Date,
         default: (new Date()).getTime(),
    },

    avatar: {
        type: String,
        default: "0"
    }

});

module.exports = mongoose.model('room', Room)
