const request = require('supertest');
const express = require('express');
const statsCollector = require('./statsCollector');
const appEmitter = require('../events/emitter');

jest.mock('../events/emitter');

describe('Stats Middleware', () => {
    let app;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(statsCollector);
        app.get('/test', (req, res) => res.status(200).send('OK'));
        app.get('/error', (req, res) => res.status(500).send('Error'));
    });

    it('should emit RequestCompleted with executionTime and masked query params', async () => {
        await request(app).get('/test?password=123&name=John&email=test@test.com');

        expect(appEmitter.emit).toHaveBeenCalledTimes(1);
        expect(appEmitter.emit).toHaveBeenCalledWith(
            'RequestCompleted',
            expect.objectContaining({
                method: 'GET',
                path: '/test',
                queryParams: expect.objectContaining({
                    password: '***',
                    email: '***',
                    name: 'John'
                }),
                status: 200,
                executionTime: expect.any(String)
            })
        );
    });

    it('should NOT log executionTime for 4xx/5xx', async () => {
        await request(app).get('/error');

        expect(appEmitter.emit).toHaveBeenCalledTimes(1);
        expect(appEmitter.emit).toHaveBeenCalledWith(
            'RequestCompleted',
            expect.objectContaining({
                status: 500,
                executionTime: null
            })
        );
    });
});