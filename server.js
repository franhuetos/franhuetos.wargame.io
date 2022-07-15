const express = require('express');
const app = express();
// var cors = require('cors');
// var corsOptions = {
//     credentials: false,
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));
const { createServer } = require("http");


const httpServer = createServer();
const io = require("socket.io")(httpServer, {
    allowEIO3: true,
    cors: {
      origin: 'http://localhost:8080',
      credentials: true
    },
  });
  

// const { Server } = require("socket.io");
// const io = new Server({});

app.use('/scenes',express.static(__dirname + '/scenes'));
app.use('/characters',express.static(__dirname + '/characters'));
app.use('/classes',express.static(__dirname + '/classes'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/index.js');
});

// app.get('/scenes/*', function (req, res) {
//     res.sendFile(__dirname + req.url);
// });

// app.get('/characters/*', function (req, res) {
//     res.sendFile(__dirname + req.url);
// });

// app.get('/classes/*', function (req, res) {
//     res.sendFile(__dirname + req.url);
// });

app.get('/images/*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

app.get('/maps/*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

app.get('/sounds/*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

app.get('/test/*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

app.get('/tilemap/*', function (req, res) {
    res.sendFile(__dirname + req.url);
});

let lastPlayderID = 0; // Keep track of the last id assigned to a new player
let users = [];

io.on('connection',function(socket){

    const newUser = {
        id: lastPlayderID++,
        socketId: socket.id
    };
    users.push(newUser);
    console.log('New user connected %O', newUser);
    io.sockets.emit('connected', newUser);
    socket.broadcast.emit('newUser', newUser);

    socket.on('newSoldier',function(pos){
        console.log('new soldier %O', pos);
        socket.broadcast.emit('newSoldier', pos);
        // socket.emit('allplayers',getAllPlayers());
        // socket.broadcast.emit('newplayer',socket.player);
    });

    socket.on('moveSoldier',function(pos){
        console.log('move soldier %O', pos);
        socket.broadcast.emit('moveSoldier', pos);
    });

    socket.on('killSoldier',function(){
        console.log('kill soldier');
        socket.broadcast.emit('killSoldier', {});
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


// app.get('*', (req, res) => {
//     console.log('request %O', req.url);
//     if(req.url.indexOf('socket.io') > -1){
//         res.sendFile(__dirname + '/node_modules/' + req.url);
//     }else{
//         res.sendFile(__dirname + req.url);
//     }

// });

function getOnePlayer(id){
    var player = {};
    io.sockets.sockets.forEach(socket => {
        if(socket.player.id === id){
            player = socket.player
        }
    });
    return player;
}

function getAllPlayers(){
    var players = [];
    io.sockets.sockets.forEach(socket => {
        players.push(socket)
    });
    return players;
}

app.listen(process.env.PORT, () => {
    console.log('Server listening on http://localhost:' + process.env.PORT);
});

io.listen(3000);