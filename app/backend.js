var robot = require('robotjs');
var fs = require('fs');

var getParent = require('./ipc');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var parent = getParent(process);

app.listen(80);

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

var currentConnection = null;
var currentToken = null;

parent.on('refreshToken', function (token) {
  currentToken = token;
  if (currentConnection !== null) {
    currentConnection.emit('token refreshed');
  }
});

io.on('connection', (socket) => {
  if (currentConnection !== null) {
    socket.emit('server busy');
    return;
  }

  socket.on('auth', (token) => {
    if (token != currentToken) {
      socket.emit('token refreshed');
      return;
    }

    socket.emit('auth');
    currentConnection = socket;
    parent.emit('connected');
    
    socket.on('mousemove', (vector) => {
      var currentPosition = robot.getMousePos();
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
