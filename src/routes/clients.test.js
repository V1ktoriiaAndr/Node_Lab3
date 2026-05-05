const request = require('supertest');
const app = require('../../app');
const sql = require('../../models/db');

jest.mock('../../models/db');

describe('Clients API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('GET /clients', async () => {
        const mockClients = [{ client_id: 101, name: 'ФОП Петренко І.О.' }];
        sql.query.mockImplementation((query, callback) => {
            callback(null, mockClients);
        });

        const res = await request(app).get('/clients');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockClients);
    });

    it('POST /clients', async () => {
        const newClient = { client_id: 106, name: 'ТОВ Нове' };
        sql.query.mockImplementation((query, values, callback) => {
            callback(null, { insertId: 106 });
        });

        const res = await request(app).post('/clients').send(newClient);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('client_id', 106);
    });

    it('DELETE /clients/:id', async () => {
        sql.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete('/clients/101');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Deleted successfully');
    });
});