const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');
const Room = require('../models/room');
const Ex = require('../models/ex');
const auth = require('../middleware/verifyToken')
// const isAdmin = require('../middleware/verifyToken')
const multer = require('multer');
const { v4: uid } = require('uuid');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/');
    },
    filename: function (req, file, cb) {
        cb(null, uid());
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});

router.post('/getAllEx', auth, async(req,res)=>{
    var room = req.body;
    var search = await Room.findOne({ _id: room._id });
    res.status(200).json(search);
})
router.post('/getEx', auth, async (req, res) => {
    var exId = req.body._id;
    var username = req.body.username;
    var room = await Room.findOne({_id: mongoose.Types.ObjectId(req.body.roomId)});
    var search = await Ex.findOne({_id: exId});
    if(room && username)
    {
        if(room.owner == username)
            res.status(200).json(search);
        else
        {
            var resp = {...search};
            var  arr = search.submission.filter((item)=> item.username == username);
            resp.submission = arr;
            res.status(200).json(resp);
        }
    }
    else
    {
        res.status(404).send('not found');
    }

    
})

router.post('/submit', auth, upload.single('submit'), async(req,res)=>{
 var tmpFile = './public/upload/' + req.file.filename;
 var dir = './private/exercise/' + req.body.idEx +'/'+ req.body.username+'/';
 if (!fs.existsSync(dir)){
    await fs.mkdirSync(dir);
}
await fs.renameSync( tmpFile ,  dir + req.file.originalname);

var resp =  {
    username: req.body.username,
    file: dir + req.file.originalname,
    time: (new Date()).getTime(),
    point: undefined,
    evaluate: ""
}
await Ex.updateOne({_id: mongoose.Types.ObjectId(req.body.idEx)}, {
    $push: {
        submission: resp
    }
});
var resp
res.json(resp);
})

router.post('/updateEx', auth, async (req, res) => {
    var data = req.body
    var search = await Room.update({_id: data.roomId, "listEx.exId": mongoose.Types.ObjectId(data.exId)}, {
        $set: {
            "listEx.$": data
        }});
    res.status(200).send(true);
})

router.post('/addEx', auth, async (req, res) => {
    var data = req.body;
    var newEx = await Ex.create({
        roomId: data.roomId,
        submission: []
    });
    data.exId = newEx._id;
    data.createTime = newEx.createTime;
    await fs.mkdirSync("./private/exercise/" + newEx._id, {recursive: true});
    var room = await Room.updateOne({_id: data.roomId}, {
        $push: {
            listEx: data
        }
    });
    console.log(room)
       const notice = {
      content: newRoom.owner + " đã tạo nhóm " + newRoom.name,
      link: "/ex/",
      from: newRoom.owner,
      time: (new Date()).getTime(),
      seen: false,
    }
    res.status(200).json(data);
})





module.exports = router;