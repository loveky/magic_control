var Emitter = require('events');

module.exports = IPC;

function IPC(process) {
  var emitter = new Emitter();
  var emit = emitter.emit;

  if (!process.send) {
    return emitter;
  }

  process.on('message', function(data) {
    emit.apply(emitter, Array.prototype.slice.call(data));
  });

  emitter.emit = function() {
    if(process.connected){
      process.send(Array.prototype.slice.call(arguments));
    }
  }

  return emitter;
}