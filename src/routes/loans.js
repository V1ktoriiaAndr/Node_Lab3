const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loans.controller.js');

router.get('/', loansController.findAll);
router.post('/', loansController.create);
router.delete('/:id', loansController.delete);

module.exports = router;