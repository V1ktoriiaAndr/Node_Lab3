const request = require('supertest');
const express = require('express');
const rateLimiter = require('./rateLimiter');

describe('Rate Limiter Middleware', () => {
    let app;

    beforeEach(() => {
        rateLimiter.clearStore();
        app = express();
        app.use(rateLimiter);
        app.get('/test', (req, res) => res.status(200).send('OK'));
    });

    it('should allow requests under the limit', async () => {
        const res = await request(app).get('/test');
        expect(res.statusCode).toEqual(200);
        expect(res.headers).toHaveProperty('x-response-time');
    });

    it('should return 429 when limit is exceeded', async () => {
        for (let i = 0; i < 100; i++) {
            await request(app).get('/test');
        }
        const res = await request(app).get('/test');
        expect(res.statusCode).toEqual(429);
        expect(res.body).toEqual({ error: 'Too Many Requests' });
    });
});