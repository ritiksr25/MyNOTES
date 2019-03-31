//Import Modules
const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const sgMail = require('@sendgrid/mail');


const sgmailapi=require("../config/confidential.js");
sgMail.setApiKey(sgmailapi.SENDGRID_API_KEY);

//Import auth check function
const authcheck= require("../config/authcheck.js");


//Import Encryption (crypto) Functions
const encryption = require("../config/encryption");



//Import Model
const Note =require("../models/Note");



//Index Router
router.get('/', authcheck.isLoggedIn, (req, res)=>{
  Note.find({user:req.user.id}).sort({date:'desc'}).then(result => {
    let results=[];
    for(var i=0;i<result.length; i++){
      var obj={
        _id:result[i]._id,
        date:result[i].date.toDateString(),
        user:result[i].user,
        text:encryption.decrypt(result[i].text),
        title:encryption.decrypt(result[i].title)
      }
      results.push(obj);
    }
    res.render('notes/dashboard.ejs', {notes:results});

  });
});


//View Note
router.get('/view-note/:id', authcheck.isLoggedIn, (req, res) => {
  Note.findOne({_id: req.params.id}).then(result => {
    var results={
      _id:result._id,
      date:result.date.toDateString(),
      user:result.user,
      text:encryption.decrypt(result.text),
      title:encryption.decrypt(result.title)
    }
    res.render("notes/view.ejs", {notes:results});
  });
});



//Post request index -Search

// Pending

router.post('/', authcheck.isLoggedIn, (req, res)=>{
  Note.find({user:req.user.id}).sort({date:'desc'}).then(result => {
    let results=[];
    for(var i=0;i<result.length; i++){
      var obj={
        _id:result[i]._id,
        date:result[i].date.toDateString(),
        user:result[i].user,
        text:encryption.decrypt(result[i].text),
        title:encryption.decrypt(result[i].title)
      }
      results.push(obj);
    }
    res.render('notes/dashboard.ejs', {notes:results});

  });
});



//Add Notes
router.get('/add-note', authcheck.isLoggedIn, (req, res) => {
  res.render('notes/add');
});


//Add Note process
router.post("/add-note", authcheck.isLoggedIn,(req,res)=>{
  Note.findOne({user: req.user.id}, (err, done) => {
    if(err){
     req.flash('error_msg', 'Oops! Something went wrong');
     res.redirect('/notes/add-note');
   } 
   else{
    let title=encryption.encrypt(req.body.title);
    let text=encryption.encrypt(req.body.text);
    Note.create({user: req.user.id ,title: title, text: text, date: Date.now()}, (err, done) => {
      if(err){
       req.flash('error_msg', 'Invalid data');
       res.redirect('/notes/add-note');
     }
     else{
       req.flash('success_msg', 'Note Added Successfully');
       res.redirect('/notes');
     }
   });
  }
});
});





//Edit Note
router.get('/edit-note/:id', authcheck.isLoggedIn, (req, res) => {
  Note.findOne({_id: req.params.id}).then(result => {
    if(result.user != req.user.id){
      req.flash('error_msg', 'Access Denied!');
      res.redirect('/notes');
    } else {

      var results={
        _id:result._id,
        date:result.date.toDateString(),
        user:result.user,
        text:encryption.decrypt(result.text),
        title:encryption.decrypt(result.title)
      }
      res.render('notes/update.ejs', {notes:results});
    }
    
  });
});



//Edit Note process
router.post('/edit-note/:id', authcheck.isLoggedIn, (req, res) => {
  Note.findOne({_id: req.params.id}).then(result => {
    result.title = encryption.encrypt(req.body.title);
    result.text = encryption.encrypt(req.body.text);
    result.date = Date.now();
    result.save().then(result => {
      req.flash('success_msg', 'Note updated Successfully');
      res.redirect('/notes');
    })
  });
});






//Delete Note
router.get("/delete-note/:id",authcheck.isLoggedIn, (req,res)=>{
  Note.deleteOne({_id: req.params.id}, (err, done) => {
    if(err){
      req.flash('error_msg', 'Oops! Something went wrong');
      res.redirect('/notes');
    }
    else{
      req.flash('success_msg', 'Note Deleted Successfully');
      res.redirect('/notes');
    }
  });
});




//Share Note
router.post("/share-note/:id", authcheck.isLoggedIn, (req,res)=>{
  Note.findOne({_id: req.params.id}).then(result => {
  const msg = { 
  to: req.body.email,
  from: 'noreply@mynotesapp.tk', 
  subject: 'Note Shared via MyNOTES',
  text: 'sometext',
  html: `<strong>Hi there!, <br><br>${req.user.name} (${req.user.username}) Shared a Note with you through MyNOTES App.<br><br>
  Title: ${encryption.decrypt(result.title)}<br>Description: ${encryption.decrypt(result.text)}<br><br>Regards<br>Team MyNOTES</strong>`,
  };
  sgMail.send(msg);

              req.flash('success_msg', 'Note Shared Successfully.');
                res.redirect('/notes');
})
});



//Export route
module.exports = router;