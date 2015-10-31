var robot = require("robotjs");

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('mousemove', (vector) => {
    console.log('mousemove');
    var currentPosition = robot.getMousePos();
    robot.moveMouse(currentPosition.x + vector.x, currentPosition.y + vector.y);
  });

  socket.on('click', () => {
    console.log('click');
    robot.mouseClick();
  });

  socket.on('previous', () => {
    console.log('previous');
    robot.keyTap('left');
  });

  socket.on('next', () => {
    console.log('next');
    robot.keyTap('right');
  });
});
