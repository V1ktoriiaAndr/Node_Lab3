const fs = require('fs').promises;
const path = require('path');
const emitter = require('../events/emitter');

const log_file = path.join(__dirname, '../logs/loan.log');

const handleLoan = async (loan) => {
    const target = process.env.TARGET_LOAN_FILE;

    if (target === 'console') {
        console.log(loan);
    } else if (target === 'file') {
        await fs.appendFile(log_file, JSON.stringify(loan) + '\n');
    }
};

emitter.on('loan', handleLoan);

module.exports = handleLoan;