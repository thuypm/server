const Room = require('../models/room');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var Mess = require('../module/room/Mess');
var User = require('../models/user');
var io ;
function connect(serverIo) {
	io = serverIo;
	io.on('connection', function (socket) {
		socket.on('getConnect', async  function(username){
			var user = await User.findOne({username: username});
			for(room of user.roomList)
				socket.join(room);
			socket.join(username);
		// socket.emit("connected", "connect thanh cong");

	});
		socket.on("seenNotice",async (username, data)=>{
			if(data === "all")
			{
				await User.updateMany({username: username, "notification.seen": false},
					{$set: {"notification.$.seen": true}});
				io.to(username).emit('seenNotice', "all");
			}
			else
			{
				await User.updateMany({username: username, "notification":data}, {$set: {"notification.$.seen": true}});
				io.to(username).emit('seenNotice', -1);
			}
		})
	})
}
async function createNotice(notification, _id, option=null)
{
	if(option)
	{
		for(var obj of  option.members)
		{
			await User.updateOne({username: obj}, {
				$push: {
					notification: notification
				}
			})
		};
		for(var i in io.sockets.connected)
		{
			if(io.sockets.connected[i].username == option.username)
				io.sockets.connected[i].join(option._id);
		}
		io.to(_id).emit("notice", notification)
	}
	else
	{
		var room = await Room.findOne({_id:_id});

		for(var obj of  room.members)
		{
			await User.updateOne({username: obj}, {
				$push: {
					notification: notification
				}
			})
		}
		io.to(_id).emit("notice", notification)
	}
	;
}


module.exports =
{
	connect: connect,
	createNotice: createNotice
}