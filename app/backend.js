var robot = require('robotjs');
var Log = require('log');
var fs = require('fs');
var EventEmitter = require('events');

var app = require('http').createServer(handler)
var io = require('socket.io')(app);

var log = new Log();
var backend = new EventEmitter();

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

var currentConnectionID = null;

io.on('connection', (socket) => {

  if (currentConnectionID !== null) {
    // TODO 断开socket并返回错误信息
    return;
  }

  currentConnectionID = socket.id;
  backend.emit('connected');

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
  });

  socket.on('scrolldown', () => {
    log.debug('scrolldown');
    robot.keyTap('down');
  });

  socket.on('rightclick', () => {
    log.debug('rightclick');
    robot.mouseClick('right');
  });
});

module.exports = backend;