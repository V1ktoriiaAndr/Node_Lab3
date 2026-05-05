const SENSITIVE_KEYS = ['password', 'token', 'email'];

const maskSensitive = (data) => {
    if (!data) return {};
    const masked = { ...data };
    for (const key in masked) {
        if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
            masked[key] = '***';
        }
    }
    return masked;
};

module.exports = maskSensitive;