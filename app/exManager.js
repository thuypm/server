const Room = require('../models/room');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var Mess = require('../module/room/Mess');
var User = require('../models/user');
var io ;
function connect(serverIo) {
	io = serverIo;
	}