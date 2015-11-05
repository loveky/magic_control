'use strict';

const robot = require('robotjs');
const fs = require('fs');
const Console = require('console').Console;
const EventEmitter = require('events').EventEmitter;

const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const backend = new EventEmitter();
const logStream = fs.createWriteStream(__dirname + '/logs/backend.log');
const logger = new Console(logStream, logStream);

app.listen(8294);
logger.log('Backend running on port 8294...');

function handler (req, res) {
  fs.readFile(__dirname + '/client.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('<h1>Something goes wrong!</h1>');
    }

    res.writeHead(200);
    res.end(data);
  });
}

let currentConnection = null;
let currentToken = null;

backend.on('refreshToken', function (token) {
  currentToken = token;
  if (currentConnection !== null) {
    currentConnection.emit('disconnect', 'token refreshed');
  }
});

io.on('connection', (socket) => {
  if (currentConnection !== null) {
    socket.emit('disconnect', 'server busy');
    return;
  }

  socket.on('auth', (token) => {
    if (token != currentToken) {
      socket.emit('disconnect', 'token refreshed');
      return;
    }

    socket.emit('auth');
    currentConnection = socket;
    backend.emit('connected');
    
    socket.on('mousemove', (vector) => {
      let currentPosition = robot.getMousePos();
      robot.moveMouse(currentPosition.x + vector.x, currentPosition.y + vector.y);
    });

    socket.on('click', () => {
      robot.mouseClick();
    });

    socket.on('previous', () => {
      robot.keyTap('left');
    });

    socket.on('next', () => {
      robot.keyTap('right');
    });

    socket.on('scrollup', () => {
      robot.keyTap('up');
    });

    socket.on('scrolldown', () => {
      robot.keyTap('down');
    });

    socket.on('rightclick', () => {
      robot.mouseClick('right');
    });
  });
});

module.exports = backend;