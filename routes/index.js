const express = require('express');
const router = express.Router();

//load controller files
const { index, contact, contactProcess } = require('../controllers/index_controller');

//Index Route
router.get('/', index);
//contact form
router.get('/contact', contact);
//Contact form Process
router.post('/contact', contactProcess);

//export router
module.exports = router;