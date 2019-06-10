const express = require("express");
const router = express.Router();
const sgMail = require('@sendgrid/mail');

//load authcheck
const isLoggedIn = require('../config/authcheck');
//load controller file
const notesController = require('../controllers/notes_controller');

//Index Router
router.get('/', isLoggedIn, notesController.index);
//View Note
router.get('/view-note/:id', isLoggedIn, notesController.view);
//search notes
router.post('/', isLoggedIn, notesController.search);
//Add Note
router.get('/add-note', isLoggedIn, notesController.add);
router.post('/add-note', isLoggedIn, notesController.addProcess);
//update Note
router.get('/edit-note/:id', isLoggedIn, notesController.update);
router.post('/edit-note/:id', isLoggedIn, notesController.updateProcess);
//Delete Note
router.get('/delete-note/:id', isLoggedIn, notesController.delete);
//Share Note
router.post('/share-note/:id', isLoggedIn, notesController.share);

//Export route
module.exports = router;