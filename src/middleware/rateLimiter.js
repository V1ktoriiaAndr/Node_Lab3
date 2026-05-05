const LIMIT = 10;
const TIME_WINDOW = 60 * 1000;

const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    let record = requestCounts.get(ip);

    if (!record || now - record.windowStart >= TIME_WINDOW) {
        record = { count: 0, windowStart: now };
        requestCounts.set(ip, record);
    }

    record.count++;

    if (record.count > LIMIT) {
        res.set('Retry-After', Math.ceil(TIME_WINDOW / 1000));
        return res.status(429).send('Too many requests');
    }

    req._startTime = now;
    next();
};

function clearRateLimitStore() {
    requestCounts.clear();
}

module.exports = rateLimiter;
module.exports.clearStore = clearRateLimitStore;