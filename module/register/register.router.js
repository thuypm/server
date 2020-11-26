const express = require('express');
const router = express.Router();
const registerController = require('./register.controller');

router.post('/', registerController.Resgister);


module.exports = router;