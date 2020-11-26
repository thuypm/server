
const Room = require('../models/room');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var messModel = require('../module/room/Mess');
var notice = require('../app/index');

module.exports = function (pio) {
  var io = pio.of("/meeting");
  io.on('connection', function (socket) {
    socket.on('join', function (username, roomId) { // thành viên mới online
      Room.findById(roomId, (err, data) => {
        if (err) socket.emit("room-not-found");
        else {
          socket.username = username;
          socket.join(roomId);
          var listFriend = [];
          io.in(roomId).clients((err, client) => {
            for (sk of client) {

              if (sk != socket.id)
                listFriend.push({
                  username: io.sockets[sk].username,
                  Id: sk
                })
            }
            io.to(roomId).emit('newUser', listFriend, username, socket.id);
          })
        }
      })
    })
    socket.on("test",(content, _id)=>{
      notice.createNotice(content, _id);
    })
    socket.on('loadMess', async (roomID, page) => {

      var room = await Room.findById(roomID).select('message');
      var mess = room.message;
      var len = mess.length;

      if(page*15+15 > len)
        if(page*15 < len )
        {
          var res = mess.slice(0,len-page*15);
          socket.emit('loadMess', res);
        }
        else
          socket.emit('loadMess', []);
        else
        {
          var res= mess.slice(-page*15-15, 15);
          socket.emit('loadMess', res);
        }
      // console.log(mess);

    })

    socket.on('screen', (roomId, video) => { // share màn hình
      io.to(roomId).emit('screen', socket.id, video);
    })
    socket.on('stopScreen', (roomId) => {
      io.to(roomId).emit('stopScreen', socket.id);
    })

    socket.on('disconnecting', (reason) => { // 1 thằng ngắt kết nối
      let rooms = Object.keys(socket.rooms);
      if (rooms[1])
        io.to(rooms[1]).emit('exitUser', socket.id);
    });

    socket.on('offVideo', (Id, roomId) => { // tắt video
      // console.log('tat video')
      var value = {
        Id: socket.id,
        username: socket.username
      };
      io.to(roomId).emit('offVideo', value);
    })

    socket.on('onVideo', (roomId, token) => {
      io.to(roomId).emit('onVideo', token, socket.id);
    })
    socket.on('res_video', (Id, tk) => {
      io.to(Id).emit('res_video', socket.id, tk);// chỉ gửi đến thằng ID 
    })


    socket.on('send_mess', function (roomId, file, message) {
      // console.log(message);
      Room.findById(roomId, (err, data) => {
        if (err) socket.emit("room-not-found");
        else {

          if (file) {
            const extension = file.split(';')[0].split('/')[1];
            const type = file.split(';')[0].split('/')[0];
            const vtHead = file.indexOf(',');
            var data = file.slice(vtHead + 1, file.length);
            const fileName = uuidv4() + '.' + extension;
            fs.writeFile('./public/room/' + roomId + '/' + fileName, data, { encoding: 'base64' }, function (err) {
              var mess = {
                sender: message.sender,
                time: message.time,
                type: type,
                content: 'room/' + roomId + '/' + fileName
              }
             // console.log(mess);
             messModel.saveMess(roomId, mess);

             io.to(roomId).emit('ib_mess', mess);

             if (message.content != "") {
              messModel.saveMess(roomId, message);
              io.to(roomId).emit('ib_mess', message);
            }


          });
          }
          else {
            messModel.saveMess(roomId, message);
            // console.log('ko co file')
            io.to(roomId).emit('ib_mess', message);
          }
        }
      })
    })
  })
}
