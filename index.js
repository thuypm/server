const express = require('express');

const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const register = require('./module/register/register.router');
const login = require('./module/login/login');
const user = require('./module/user');
const cors = require('cors');
const room = require('./module/room/index');
const exercise = require('./module/exercise')
// const { ExpressPeerServer } = require('peer');
require('dotenv/config');


app.use(cors({credentials: true, origin: '*'}));

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
        .then(()=>console.log(`Connect db successfully !`))
        .catch((err) => console.log(`Connect db failed `, err));
app.use(bodyParser({limit: '50mb'}));

app.use(express.static("public"));
app.use('/signup', register);
app.use('/signin', login);
app.use('/room', room);
app.use('/user', user);
app.use('/ex', exercise);
app.use('/signup', exercise);

const port = process.env.PORT
app.set('port', port);
// app.listen(port, ()=> console.log(`Server is listening on port ${port}`));

var server = require('http').createServer(app);
server.listen(port);


// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   path: '/myapp'
// });

// app.use('/peerjs', peerServer);
// server.on('error', onError);
// server.on('listening', onListening);

var io = require('socket.io').listen(server);

require("./app/index").connect(io);
require('./app/socket')(io);

