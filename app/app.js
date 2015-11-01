var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

var backend = require('./backend');

var mainWindow = null;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 520, height: 750, title: 'MagicControl'});
  mainWindow.loadUrl('file://' + __dirname + '/server.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('ip', function (event) {

	event.sender.send('ip', 'IP address');
});