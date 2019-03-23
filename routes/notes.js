//Import Modules
const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();


//Check Authentication

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'You must be Logged in...');
    res.redirect('/users/login');
  }



//Import Model
const Note =require("../models/Note");


//Index Router
router.get('/', isLoggedIn, (req, res)=>{
    Note.find({user:req.user.id}).sort({date:'desc'}).then(result => {
      res.render('notes/dashboard.ejs', {notes:result});
   });
});


//Post request index -Search
router.post('/', isLoggedIn, (req, res)=>{
    Note.find({user:req.user.id, title:{$regex: req.body.title }}).sort({date:'desc'}).then(result => {
      res.render('notes/dashboard.ejs', {notes:result});
   });
});



//Add Notes
router.get('/add-note', isLoggedIn, (req, res) => {
  res.render('notes/add');
});


//Add Note process
router.post("/add-note", isLoggedIn,(req,res)=>{
    Note.findOne({user: req.user.id, title: req.body.title}, (err, entry) => {
        if(err){
        	req.flash('error_msg', 'Oops! Something went wrong');
            res.redirect('/notes/add-note');
    	}
        if(entry){
        	req.flash('error_msg', 'Note Already Exist');
            res.redirect('/notes/add-note');
        } 
        else{
            Note.create({user: req.user.id ,title: req.body.title, text: req.body.text}, (err, done) => {
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
router.get('/edit-note/:id', isLoggedIn, (req, res) => {
  Note.findOne({_id: req.params.id}).then(result => {
    if(result.user != req.user.id){
        req.flash('error_msg', 'Access Denied!');
        res.redirect('/notes');
    } else {
      res.render('notes/update.ejs', {notes:result});
    }
    
  });
});



//Edit Note process
router.put('/edit-note/:id', isLoggedIn, (req, res) => {
  Note.findOne({_id: req.params.id}).then(result => {
    result.title = req.body.title;
    result.text = req.body.text;
    result.save().then(result => {
        req.flash('success_msg', 'Note updated Successfully');
        res.redirect('/notes');
      })
  });
});






//Delete Note
router.get("/delete-note/:id",isLoggedIn, (req,res)=>{
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







//Export route
module.exports = router;