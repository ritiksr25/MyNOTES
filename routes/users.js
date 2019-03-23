//Import Modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Import Model
require('../models/User');
const users = mongoose.model('users');

//Authentication Check
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'You must be Logged in...');
    res.redirect('/users/login');
  }



//Login Route
router.get('/login', (req, res) => {
  res.render('users/login.ejs');
});


//Login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/notes',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});



//Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



//Register Route
router.get('/register', (req, res) => {
  res.render('users/register.ejs');
});


//Register Process
router.post('/register', (req, res) => {
	let errors=[];

	if(req.body.password != req.body.password2){
    errors.push('Passwords do not match');
  }
else
   if(req.body.password.length < 5){
    errors.push('Password must be at least of 5 characters');
  }

  if(errors.length > 0){
    res.render('users/register.ejs', {
      error: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } 

  else {
	users.findOne({username: req.body.username}, (err, entry) => {
        if(err){
        	req.flash('error_msg', 'Oops! Something went wrong');
            res.redirect('/users/register');
    	}
        if(entry){
        	req.flash('error_msg', 'Username Already Registered');
            res.redirect('/users/register');
        } 
		else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if(err) console.log(err);
              req.body.password = hash;
              users.create({
              	name: req.body.name,
                username: req.body.username,
                password: req.body.password
            }, (err, done) => {
            if(err){
        	    req.flash('error_msg', 'Invalid data');
                res.redirect('/users/register');
    	    }
            else{
        	    req.flash('success_msg', 'Registered Successfully. You can login now');
                res.redirect('/users/login');
           }
            });
                
          });
        });
      }
  });
}
});
          
        


//Change Password route
router.get("/change-password", isLoggedIn, (req,res)=>{
  res.render("users/change-password.ejs");
})

//Change Password process
router.post("/change-password", (req,res)=>{
  let errors=[];
  bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.oldpassword, salt, (err, hash) => {
              if(err) console.log(err);
              req.body.oldpassword = hash;
        });
    });

  if(req.user.password!=req.body.oldpassword)
    errors.push("Old Password not matched.");
if(req.body.newpassword != req.body.newpassword2){
    errors.push('New Passwords do not match');
  }
else
   if(req.body.newpassword.length < 5){
    errors.push('New Password must be at least of 5 characters');
  }

  if(errors.length > 0){
    res.render('users/change-password.ejs', {error: errors});
  } 

  else {
  users.findOne({_id: req.user.id}, (err, entry) => {
        if(err){
          req.flash('error_msg', 'Oops! Something went wrong');
            res.redirect('/users/change-password');
      }
        if(entry){
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
              if(err) console.log(err);
              req.body.newpassword = hash;
              users.updateOne({password: req.body.newpassword}, (err, done) => {
            if(err){
              req.flash('error_msg', 'Invalid data');
                res.redirect('/users/register');
          }
            else{
              req.flash('success_msg', 'Password Changed Successfully...');
                res.redirect('/notes');
           }
            });
                
          });
        });
      }
  });
}
});



//View profile
router.get("/view-profile",isLoggedIn, (req,res)=>{
  res.render("users/userprofile.ejs");
});

//Export router
module.exports = router;