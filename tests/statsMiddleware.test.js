jest.mock('../src/events/emitter', () => ({
    on: jest.fn(),
    emit: jest.fn(),
    removeAllListeners: jest.fn()
}));

const request = require('supertest');
const express = require('express');
const statsCollector = require('../src/middleware/statsCollector');
const emitter = require('../src/events/emitter');

describe('Stats Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();

        app.use(express.json());

        app.use(statsCollector);

        app.get('/test', (req, res) => res.status(200).json({ ok: true }));
        app.get('/error', (req, res) => res.status(500).json({ err: true }));

        emitter.emit.mockClear();
    });

    it('should mask sensitive query params', async () => {
        await request(app)
            .get('/test?password=123&email=test@mail.com&name=John');

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(emitter.emit).toHaveBeenCalledWith(
            'RequestCompleted',
            expect.objectContaining({
                queryParams: expect.objectContaining({
                    password: '***',
                    email: '***',
                    name: 'John'
                }),
                method: 'GET',
                userAgent: expect.any(String)
            })
        );
    });

    it('should NOT log executionTime for 4xx/5xx', async () => {
        await request(app).get('/error');
        await new Promise(resolve => setTimeout(resolve, 50));

        const lastCall = emitter.emit.mock.calls[emitter.emit.mock.calls.length - 1];

        expect(lastCall).toBeDefined();

        const stats = lastCall[1];

        expect(stats.status).toBe(500);
        expect(stats.executionTime).toBeNull();
    });

    it('should mask sensitive query params', async () => {
        await request(app)
            .get('/test?password=123&email=test@mail.com&name=John');

        await new Promise(resolve => setTimeout(resolve, 100)); // 👈 Збільште час

        // 👇 ДОДАЙТЕ ЦЕЙ ЛОГ ПЕРЕД expect:
        console.log('🔍 [TEST] emitter.emit.mock.calls:', emitter.emit.mock.calls);
        console.log('🔍 [TEST] emitter.emit.mock.calls.length:', emitter.emit.mock.calls.length);

        expect(emitter.emit).toHaveBeenCalledWith(
            'RequestCompleted',
            expect.objectContaining({
                queryParams: expect.objectContaining({
                    password: '***',
                    email: '***',
                    name: 'John'
                }),
                method: 'GET',
                userAgent: expect.any(String)
            })
        );
    });
});
