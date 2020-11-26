const Room = require('../../models/room');
var mongoose = require('mongoose');
async function GetRoom(req, res) {
	if(!mongoose.Types.ObjectId.isValid(req.body.roomId))
		res.send(false);
	else{
		const newRoom = await Room.findById(req.body.roomId);
    res.send(newRoom)
	}
    
}

module.exports = GetRoom