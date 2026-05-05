const fs = require('fs');
const path = require('path');
const appEmitter = require('../events/emitter');

const logFilePath = path.join(__dirname, '../../stats.json');

appEmitter.on('RequestCompleted', (stats) => {
    fs.readFile(logFilePath, (err, data) => {
        let logs = [];
        if (!err && data.length > 0) {
            try {
                logs = JSON.parse(data);
            } catch (e) {
                logs = [];
            }
        }
        logs.push({ timestamp: new Date().toISOString(), ...stats });
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), () => {});
    });
});

module.exports = appEmitter;