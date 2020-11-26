const User = require('../../models/user');
const Room = require('../../models/room');

async function RemoveRoom(req, res) {
    let thisRoom = await Room.findById(req.body.roomId);
    // chu phong moi duoc xoa
    if(thisRoom.owner == req.body.username){

        Room.findOneAndDelete({ _id: req.body.roomId }, async function (err) {
            if(err) console.log(err);
            else {
                for(i = 0; i < thisRoom.members.length; i++){
                              await User.updateOne({username: thisRoom.members[i]},
                                    {
                                        $pull: {
                                            roomList: req.body.roomId
                                        }
                                    })
                            }

                            res.send("done");
            }
        });
        
    }
    else {
        res.send(false);
    }
}

module.exports = RemoveRoom;