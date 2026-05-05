const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const rateLimiter = require('./src/middleware/rateLimiter');
const statsCollector = require('./src/middleware/statsCollector');
require('./src/subscribers/statsSubscriber');

const clientsRouter = require('./src/routes/clients');
const loansRouter = require('./src/routes/loans');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lab 3-4 API',
            version: '1.0.0'
        }
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(rateLimiter);
app.use(statsCollector);

app.use('/clients', clientsRouter);
app.use('/loans', loansRouter);

module.exports = app;