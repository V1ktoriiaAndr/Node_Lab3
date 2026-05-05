const SENSITIVE_KEYS = /^(password|token|email)$/i;

function maskObject(obj) {
    if (!obj || typeof obj !== 'object') {
        return {};
    }
    const maskedObj = {...obj};
    for (const key in maskedObj) {
        if (SENSITIVE_KEYS.test(key)) {
            maskedObj[key] = '***';
        } else if (typeof maskedObj[key] === 'object') {
            maskedObj[key] = maskObject(maskedObj[key]);
        }
    }
    return maskedObj;
}

module.exports = { maskObject };