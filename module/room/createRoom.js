const User = require('../../models/user');
const Room = require('../../models/room');
var fs = require('fs');
var notify = require("../../app/index");

async function CreateRoom(req, res){
    req.body.members.push(req.body.owner); // do lúc gửi lên chưa thêm admin cũng là 1 thành viên!
    const newRoom = await Room.create({
     owner: req.body.owner,
     name: req.body.name,
     members: req.body.members
   });
    const notice = {
      content: newRoom.owner + " đã tạo nhóm " + newRoom.name,
      link: "/allGroup",
      from: newRoom.owner,
      time: (new Date()).getTime(),
      seen: false,
    }
    // them room nay vao danh ach room cua moi user vua duoc them

    fs.mkdir('./public/room/'+ newRoom._id,function(err){
     if (err) {
      return console.error(err);
    }
    
  });
    fs.copyFile('./public/room/unknown.jpg', './public/room/'+newRoom._id+'/' + newRoom._id + '.jpg' ,async (err)=>{
      if(err)
        throw err;
      else
      {
        var i = 0;
        for(i = 0; i < req.body.members.length; i++){
          await User.updateOne({username: req.body.members[i]},
          {
            $push: {
              roomList: newRoom._id,
            }
          })
        };
      notify.createNotice(notice, newRoom._id, newRoom )
        res.send(newRoom)
      }
    });          

  }

  module.exports = CreateRoom;

