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
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 380, height: 500, title: 'MagicControl', 'use-content-size': true});
  mainWindow.loadUrl('file://' + __dirname + '/server.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('ip', function (event) {
  event.sender.send('ip', getIP());
});

backend.on('connected', function () {
  mainWindow.webContents.send('connected');
});