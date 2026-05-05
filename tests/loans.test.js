const request = require('supertest');
const express = require('express');
const loansRouter = require('../src/routes/loans');

describe('Loan Endpoints', () => {
    let app;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/loans', loansRouter);
    });

    it('should allow partial repayment', async () => {
        const { body: { loanId } } = await request(app)
            .post('/api/loans')
            .send({ clientId: 'c1', amount: 10000, dueDate: '2026-12-01' })
            .expect(201);

        const { body } = await request(app)
            .post(`/api/loans/${loanId}/repayments`)
            .send({ amount: 3000 })
            .expect(200);

        expect(body.remaining).toBe(7000);
    });
});