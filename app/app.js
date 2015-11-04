'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const ipc = require('ipc');
const fs = require('fs');
const Console = require('console').Console;

const backend = require('./backend');
const getIP = require('./getIP');

const logStream = fs.createWriteStream(__dirname + '/logs/app.log');
const logger = new Console(logStream, logStream);


let mainWindow = null;

app.on('window-all-closed', function() {
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
  let token = Math.random();
  logger.log('http://' + getIP() + ':8294/?token=' + token);
  event.sender.send('refreshToken', 'http://' + getIP() + ':8294/?token=' + token);
  backend.emit('refreshToken', token);
});

backend.on('connected', function () {
  mainWindow.webContents.send('connected');
});