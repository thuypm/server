const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    // check username
    // console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(200).send(false);
        return;
    }

    //check password

    const pwd = await bcrypt.compare(req.body.password, user.password);
    if (!pwd) {
        res.status(200).send(false);
        return;
    };

    // tạo token

    // truyền các giá trị của user vào token
    const payload = {
        id: user._id,
    }

    const token = await jwt.sign(payload, process.env.TOKEN_SECRET);

    // user.token = token;
    //  console.log(user);
    res.status(200).json({
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        meeting: user.meeting,
        token: token,
    });

})

module.exports = router;