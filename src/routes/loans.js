const express = require('express');
const router = express.Router();

const db = require('../db');

router.post('/', (req, res) => {
    const {clientId, amount, dueDate} = req.body;
    const loanId = `loan_${Date.now()}`;

    loans.set(loanId, {
        clientId,amount,remaining: amount,
        issueDate: new Date().toISOString(),
        dueDate,
        repayments: []
    });

    res.status(201).json({loanId, message: 'Кредит видано'})
});

router.post('/:id/repayments', (req, res) => {
    const loan = loans.get(req.params.id);
    if (!loan) return res.status(404).json({error: 'Кредит не знайдено'});

    const { amount } = req.body;
    if (amount <= 0 || amount > loan.remaining) {
        return res.status(400).json({ error: 'Некоректна сума погашення' });
    }

    loan.remaining -= amount;
    loan.repayments.push({amount, date: new Date().toISOString(),})

    res.json({message: 'Часткове погашення прийнято', remaining: loan.remaining});
});

router.get('/', getAllLoans);       
router.get('/:id', getLoanById);
router.delete('/:id', deleteLoan);

module.exports = router;