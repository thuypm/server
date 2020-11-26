const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
const auth = require('../middleware/verifyToken');
const multer = require('multer');
var fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/');
    },
    filename: function (req, file, cb) {
        cb(null, 'tmp' + '.jpg');
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png'
        || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/search', auth, async (req, res) => {
    const name = req.body.username;

    const search = await User.find({ username: new RegExp(name) }, { '_id': 0, 'username': 1 });
    res.status(200).json(search);
})
router.post('/getUser', auth, async (req, res) => {
    const name = req.body.username;
    const search = await User.findOne({ username: req.body.username },{ '_id': 0, 'password': 0 });
    res.status(200).json(search);
})
router.post('/getAllMeeting', auth, async (req, res) => {
    const room = await Room.find({ $or: [{ members: req.body.username }] })
        .select('_id name avatar members owner timeCreate');

    const rooms = {
        message: 'get room successfully',
        content: room
    }
    res.status(200).json(rooms);
})

router.post('/avatar', upload.single('avatar'), auth, async (req, res) => {
    var tmpFile = './public/upload/' + req.file.filename;
    fs.rename(tmpFile, './public/user/' + req.body.username + '.jpg', () => {
        res.send(req.body.username + '.jpg');
    });


})




module.exports = router;