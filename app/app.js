var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var child_process = require('child_process'); 

var getBackend = require('./ipc');
var getIP = require('./getIP');

var mainWindow = null;

var backendProcess = child_process.spawn('node', ['./app/backend.js'], {stdio: [null, null, null, 'ipc'] });
backendProcess.on('error', function (err) {
  console.log('Failed to start child process.');
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

  event.sender.send('refreshToken', 'http://' + getIP() + '/?token=' + token);
  backend.emit('refreshToken', token);
});

backend.on('connected', function () {
  mainWindow.webContents.send('connected');
});