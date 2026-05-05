const express = require('express');
const rateLimiter = require('./src/middleware/rateLimiter');
const statsCollector = require('./src/middleware/statsCollector');
require('./src/subscribers/statsSubscriber');

const clientsRouter = require('./src/routes/clients');
const loansRouter = require('./src/routes/loans');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(rateLimiter);
app.use(statsCollector);

app.use('/clients', clientsRouter);
app.use('/loans', loansRouter);

module.exports = app;