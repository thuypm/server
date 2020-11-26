const jwt = require('jsonwebtoken');
const Room = require('../models/room');
const mongoose = require('mongoose');
async function isAdmin(req, res, next)
{
    const token = req.header('token');
    const username = req.body.username;
    const roomId = req.body.roomId;
    const room = await Room.findOne({_id:mongoose.Types.ObjectId(req.body.roomId)});

    if(!token)return res.status(401).send('Access Denied !');s
    if(room.owner !== username)
        return res.status(401).send('Access Denied !');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

module.exports =  isAdmin;