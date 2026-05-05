const express = require('express');
const rateLimiter = require('./middleware/rateLimiter');
const statsCollector = require('./middleware/statsCollector');
const loansRouter = require('./routes/loans');
require('./subscribers/statsSubscriber');

const app = express();
app.use(express.json());

app.use(rateLimiter);
app.use(statsCollector);
app.use('/api/loans', loansRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));