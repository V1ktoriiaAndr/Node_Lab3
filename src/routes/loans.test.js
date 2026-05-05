const request = require('supertest');
const app = require('../../app');
const sql = require('../../models/db');

jest.mock('../../models/db');

describe('Loans API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET /loans', async () => {
        const mockLoans = [{ loan_id: 1, loan_amount: 10000.00 }];
        sql.query.mockImplementation((query, callback) => {
            callback(null, mockLoans);
        });

        const res = await request(app).get('/loans');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockLoans);
    });

    it('POST /loans', async () => {
        const newLoan = { loan_id: 8, loan_amount: 15000, client_id: 101, loan_type_id: 1 };
        sql.query.mockImplementation((query, values, callback) => {
            callback(null, { insertId: 8 });
        });

        const res = await request(app).post('/loans').send(newLoan);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('loan_id', 8);
    });

    it('DELETE /loans/:id', async () => {
        sql.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete('/loans/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Deleted successfully');
    });
});