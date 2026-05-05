const { EventEmitter } = require('events');

const statsEmitter = new EventEmitter();
module.exports = statsEmitter;