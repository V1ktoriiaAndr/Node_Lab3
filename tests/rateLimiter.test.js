const request = require('supertest');
const express = require('express');
const rateLimiter = require('../src/middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
    let app;

    beforeEach(() => {
        const { clearStore } = require('../src/middleware/rateLimiter');
        clearStore();

        app = express();
        app.use(rateLimiter);
        app.get('/test', (req, res) => res.status(200).json({ ok: true }));
    });

    it('should allow requests under the limit', async () => {
        for (let i = 0; i < 10; i++) {
            const res = await request(app).get('/test');
            expect(res.status).toBe(200);
        }
    });

    it('should return 429 when limit is exceeded', async () => {
        for (let i = 0; i < 10; i++) {
            await request(app).get('/test');
        }

        const res = await request(app).get('/test');
        expect(res.status).toBe(429);
        expect(res.text).toBe('Too many requests');
    });

    it('should reset the count after the time window passes', async () => {
        const originalDateNow = global.Date.now;
        let mockedTime = originalDateNow();

        global.Date.now = jest.fn(() => mockedTime);

        try {
            for (let i = 0; i < 10; i++) {
                await request(app).get('/test');
            }

            mockedTime += 61000;

            const res = await request(app).get('/test');
            expect(res.status).toBe(200);
        } finally {
            global.Date.now = originalDateNow;
        }
    });
});