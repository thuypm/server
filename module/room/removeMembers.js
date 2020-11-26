const User = require('../../models/user');
const Room = require('../../models/room');

async function RemoveMembers(req, res) {
    let thisRoom = await Room.findById(req.body.roomId);
    // chu phong moi duoc xoa user hoac nguoi do tu out.
    if(thisRoom.owner === req.body.username ||
        (req.body.members.length === 1 && req.body.members[0] === req.body.username)){
        await Room.updateOne({_id: req.body.roomId}, {
            $pull: {
                members: { $in: req.body.members}
            }})

        // xoa room nay trong roomList cua nhung nguoi vua bi kich.
        var i = 0;
        for(i = 0; i < req.body.members.length; i++){
            await User.updateOne({username: req.body.members[i]},
                {
                    $pull: {
                        roomList: req.body.roomId
                    }
                })
        }
        let room = await Room.findById(req.body.roomId);
        res.send(room);
    }
    else {
        res.send(false);
    }


}

module.exports = RemoveMembers;