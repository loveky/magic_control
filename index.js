var robot = require('robotjs');
var Log = require('log');
var fs = require('fs');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var log = new Log();

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
  log.debug('connected');
  
  socket.on('mousemove', (vector) => {
    log.debug('mousemove');
    var currentPosition = robot.getMousePos();
    robot.moveMouse(currentPosition.x + vector.x, currentPosition.y + vector.y);
  });

  socket.on('click', () => {
    log.debug('click');
    robot.mouseClick();
  });

  socket.on('previous', () => {
    log.debug('previous');
    robot.keyTap('left');
  });

  socket.on('next', () => {
    log.debug('next');
    robot.keyTap('right');
  });

  socket.on('scrollup', () => {
    log.debug('scrollup');
    robot.keyTap('up');
    // robot.scrollMouse(50, "up");
  });

  socket.on('scrolldown', () => {
    log.debug('scrolldown');
    robot.keyTap('down');
    // robot.scrollMouse(50, "down");
  });

  socket.on('rightclick', () => {
    log.debug('rightclick');
    robot.mouseClick('right');
  });
});
