const appEmitter = require('../events/emitter');
const maskSensitive = require('../utils/maskSensitive');

const statsCollector = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        let executionTime = null;

        if (res.statusCode >= 200 && res.statusCode < 400) {
            const diff = process.hrtime(start);
            executionTime = `${(diff[0] * 1000 + diff[1] / 1e6).toFixed(2)}ms`;
        }

        const stats = {
            path: req.path,
            method: req.method,
            queryParams: maskSensitive(req.query),
            params: maskSensitive(req.params),
            userAgent: req.get('User-Agent'),
            status: res.statusCode,
            executionTime: executionTime
        };
        appEmitter.emit('RequestCompleted', stats);
    });
    next();
};

module.exports = statsCollector;