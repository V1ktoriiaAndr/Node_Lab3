const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients.controller.js');

router.get('/', clientsController.findAll);
router.post('/', clientsController.create);
router.delete('/:id', clientsController.delete);

module.exports = router;