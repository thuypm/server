const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ex = new Schema({
	roomId: String,
    // name: String,
    // creater: String,
    createTime: {
        type: Number,
        default: (new Date()).getTime(),
    },
    // deadline: Number,
    submission: Array,
});

module.exports = mongoose.model('Ex', Ex)
