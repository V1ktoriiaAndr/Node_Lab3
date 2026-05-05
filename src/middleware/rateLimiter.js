const rateLimitMap = new Map();
const LIMIT = 100;
const TIME_WINDOW = 60000;

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, startTime: currentTime });
    } else {
        const data = rateLimitMap.get(ip);
        if (currentTime - data.startTime > TIME_WINDOW) {
            data.count = 1;
            data.startTime = currentTime;
        } else {
            data.count++;
            if (data.count > LIMIT) {
                return res.status(429).json({ error: 'Too Many Requests' });
            }
        }
    }

    const start = process.hrtime();
    const originalWriteHead = res.writeHead;

    res.writeHead = function (...args) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const diff = process.hrtime(start);
            const time = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
            res.setHeader('X-Response-Time', `${time}ms`);
        }
        return originalWriteHead.apply(res, args);
    };

    next();
};

rateLimiter.clearStore = () => {
    rateLimitMap.clear();
};

module.exports = rateLimiter;