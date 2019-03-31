//Import Modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const expressValidator= require("express-validator");
const sgMail = require('@sendgrid/mail');


//Import Model
require('../models/User');
const users = mongoose.model('users');


//Import functions
const authcheck= require("../config/authcheck.js");
const {body,validationResult } = require('express-validator/check');


//SGMail setup
const sgmailapi=require("../config/confidential.js");
sgMail.setApiKey(sgmailapi.SENDGRID_API_KEY);



//Login Route
router.get('/login',authcheck.logggedInAlready, (req, res) => {
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
router.get('/register',authcheck.logggedInAlready, (req, res) => {
  res.render('users/register.ejs');
});


//Register Process
router.post('/register', (req, res) => {
let username = req.body.username;
let password = req.body.password;
let password2 = req.body.password2;
req.checkBody('username', 'Invalid Email...').notEmpty().isEmail();
req.checkBody('password', 'Password length should be between 5 and 20').notEmpty().len(5, 20);

var errors = req.validationErrors();

if(password!=password2){
  req.flash("error_msg", "Confirm password not matched...");
  res.redirect("/users/Register");
}
else
  
if(errors){
    res.render("users/register", {error:errors});
  }
   else{
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
                name: req.body.name.toUpperCase(),
                username: req.body.username,
                password: req.body.password
            }, (err, done) => {
            if(err){
              req.flash('error_msg', 'Invalid data');
                res.redirect('/users/register');
          }
            else{
const msg = { 
  to: req.body.username,
  from: 'noreply@mynotesapp.tk', 
  subject: 'Registered on MyNOTES',
  text: 'sometext',
  html: `<strong>Hi ${req.body.name.toUpperCase()}, <br><br>Thanks for registering on the application MyNOTES. Please tell us about your experience in this 3 minute Feedback. <br>Your feedback will help us improve and create a better experience for you.<br><br>Please fill in the attached Google form with your precious feedback.<br>Link: https://goo.gl/forms/5RwiV1nG2NMJDjDP2<br><br>Regards<br>Team MyNOTES</strong>`,
  };
  sgMail.send(msg);

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
router.get("/change-password", authcheck.isLoggedIn, (req,res)=>{
  res.render("users/change-password.ejs");
})

//Change Password process
router.post("/change-password", (req,res)=>{
let oldpassword = req.body.oldpassword;
let newpassword=req.body.newpassword;
let newpassword2 = req.body.newpassword2;

users.findOne({_id:req.user.id}).then(user=> {
    bcrypt.compare(oldpassword, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        req.checkBody('newpassword', 'Password length should be between 5 and 20').notEmpty().len(5, 20);
        var errors = req.validationErrors();
      if(newpassword!=newpassword2){
      req.flash("error_msg", "Confirm new passwords not matched...");
      res.redirect("/users/change-password");
      }
      if(user.password==newpassword){
        req.flash("error_msg", "New Password can't be old Password.");
      }
      else
        if(errors)
          res.render("users/change-password", {error:errors});
      else{
      users.findOne({_id: req.user.id}).then(result => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
            if(err) console.log(err);
            req.body.newpassword = hash;
            result.password = req.body.newpassword;
            result.save().then(result => {
  const msg = { 
  to: req.user.username,
  from: 'noreply@mynotesapp.tk', 
  subject: 'Password Changed Successfully',
  text: 'sometext',
  html: `<strong>Hi ${req.user.name}, <br><br>Your Password for MyNOTES has been changed successfully. If you didnot initiated this change, please contact us at <a href = "mailto:support@mynotesapp.tk">support@mynotesapp.tk</a> <br><br>Regards<br>Team MyNOTES</strong>`,
  };
  sgMail.send(msg);

            req.flash('success_msg', 'Password Changed Successfully.');
            res.redirect('/notes');
          })
        });
      });
    });
  }
}
else{
  req.flash('error_msg', 'Old Password not matched.');
  res.redirect('/users/change-password');
}
});
});
});




//View profile
router.get("/view-profile",authcheck.isLoggedIn, (req,res)=>{
  res.render("users/userprofile.ejs");
});



//Export router
module.exports = router;