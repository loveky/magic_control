'use strict';

let os = require('os');

function getIP () {
  let networkInterfaces = os.networkInterfaces();
  let interfaces, name, ip;

  for (name of Object.keys(networkInterfaces)) {
    interfaces = networkInterfaces[name];
    for (ip of interfaces) {
      if (ip.family === 'IPv4' && ip.address !== '127.0.0.1') {
        return ip.address;
      }
    }
  }
}

module.exports = getIP;