const appEmitter = require('../events/emitter');
const maskSensitive = require('../utils/maskSensitive');

const statsCollector = (req, res, next) => {
    res.on('finish', () => {
        const stats = {
            path: req.path,
            method: req.method,
            query: maskSensitive(req.query),
            params: maskSensitive(req.params),
            userAgent: req.get('User-Agent'),
            statusCode: res.statusCode
        };
        appEmitter.emit('requestCompleted', stats);
    });
    next();
};

module.exports = statsCollector;