var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    PassThrough = require('stream').PassThrough;

util.inherits(Request, EventEmitter);

function Request(data, options) {
  EventEmitter.call(this);
  
  options = options || {};
  this.fail = options.fail || false;
  this.stringify = options.stringify !== false;
  
  this.response = new PassThrough();
  this.response.statusCode = options.statusCode || 200;
  this.response.write(this.stringify ? JSON.stringify(data) : data);
  this.response.end();
};

Request.prototype.end = function() {
  if (this.fail) {
    this.emit('error', new Error());
  } else {
    this.emit('response', this.response);
  }
};

module.exports = Request;
