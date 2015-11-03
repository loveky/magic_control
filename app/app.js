var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');
var child_process = require('child_process'); 
var Console = require('console').Console;

var getBackend = require('./ipc');
var getIP = require('./getIP');

var logStream = fs.createWriteStream(__dirname + '/logs/app.log');
var logger = new Console(logStream, logStream);


var mainWindow = null;

var backendProcess = child_process.spawn('node', ['./app/backend.js'], {stdio: [null, null, null, 'ipc'] });
backendProcess.on('error', function (err) {
  logger.log('Failed to start child process.');
  logger.log(err)
});

var backend = getBackend(backendProcess);

app.on('window-all-closed', function() {
  backendProcess.disconnect();
  backendProcess.kill();
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 400,
    title: 'Magic Control',
    'use-content-size': true,
    resizable: false
  });
  mainWindow.loadUrl('file://' + __dirname + '/server.html');
  mainWindow.setMenu(null);
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('refreshToken', function (event) {
  var token = Math.random();
  logger.log('http://' + getIP() + ':8294/?token=' + token);
  event.sender.send('refreshToken', 'http://' + getIP() + ':8294/?token=' + token);
  backend.emit('refreshToken', token);
});

backend.on('connected', function () {
  mainWindow.webContents.send('connected');
});