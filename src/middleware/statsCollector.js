const emitter = require('../events/emitter');
const { maskObject } = require('../utils/maskSensitive');

const statsCollector = (req, res, next) => {
    try {
        const { method = 'UNKNOWN', originalUrl = '/', body = {} } = req || {};

        const pathParams = maskObject(req.params || {});
        const queryParams = maskObject(req.query || {});
        const userAgent = req.headers?.['user-agent'] || 'Unknown';
        const maskedBody = maskObject(body || {});

        const stats = {
            method,
            path: originalUrl,
            pathParams,
            queryParams,
            userAgent,
            timestamp: Date.now(),
            maskedBody,
            status: null,
            executionTime: null
        };

        const finalize = () => {
            try {
                stats.status = res.statusCode || null;

                if (stats.status >= 200 && stats.status < 400 && req._startTime) {
                    stats.executionTime = Date.now() - req._startTime;
                }

                emitter.emit('RequestCompleted', stats);
            } catch (err) {
                console.error('❌ [STATS] Error in finalize:', err.message);
            }
        };

        let finalized = false;
        const safeFinalize = () => {
            if (finalized) return;
            finalized = true;
            finalize();
        };

        if (typeof res.on === 'function') {
            res.on('finish', safeFinalize);
            res.on('end', safeFinalize);
            res.on('close', safeFinalize);
        }

        setImmediate(() => {
            if (!finalized && stats.status === null) {
                safeFinalize();
            }
        });

        next();
    } catch (err) {
        console.error('❌ [STATS] Middleware error:', err.message);
        next(err);
    }
};

module.exports = statsCollector;