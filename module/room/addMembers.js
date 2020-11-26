const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Room = require('../../models/room');
var mongoose = require('mongoose');
async function AddMembers(req, res) {


// thiếu kiểm tra xem có tồn tại room hay ko ?

 var  newRoom ;
 if(!mongoose.Types.ObjectId.isValid(req.body.roomId))
       {
        res.send(false);
        return;
       } 
    else{
      newRoom = await Room.findById(req.body.roomId);
    }


    await Room.updateOne({_id: req.body.roomId}, {
        $push: {
            members: req.body.members
        }})

    // them room nay vao danh sach room cua moi user vua duoc them
    var i = 0;
    for(i = 0; i < req.body.members.length; i++){
        await User.updateOne({username: req.body.members[i]},
            {
                $push: {
                    roomList: req.body.roomId
                }
            })
    }

    let room = await Room.findById(req.body.roomId);
    res.send(room);

}

module.exports = AddMembers;