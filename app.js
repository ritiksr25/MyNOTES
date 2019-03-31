//Import Modules
const express = require("express");
const ejs = require("ejs");
const bodyparser=require("body-parser");
const path=require("path");
const flash=require("connect-flash");
const methodOverride = require('method-override');
const mongoose=require("mongoose");
const mongodb=require("mongodb");
const bcrypt=require("bcryptjs");
const expressValidator=require("express-validator");
const session=require("express-session");
const passport=require("passport");
const sgMail = require('@sendgrid/mail');



//Import Routes
const user=require("./routes/users");
const note=require("./routes/notes");


//Setting Express middleware
const app = express();


//Setting Up Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(session({secret: 'secret', resave: false, saveUninitialized: true, cookie: { secure: false }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(flash());


//Flash and user variables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Import Configurations
require('./config/passport')(passport);

const authcheck=require("./config/authcheck");

const confidential=require("./config/confidential");



//SGMail setup
sgMail.setApiKey(confidential.SENDGRID_API_KEY);




//Database Connection Definition
mongoose.promise=global.promise;
const dburl=require('./config/confidential').mongoURI;
mongoose.connect(dburl,{useNewUrlParser: true}, (err,database)=>{
	if(err) console.log("Error in Database Connectivity..."+err);
	else{
        console.log("Database Connected Successfully...");

    } 
});



//Index Route
app.get("/", authcheck.logggedInAlready, (req,res)=>{
	res.render('users/welcome');
});


//About Route
app.get("/about", (req,res)=>{
	res.render("users/about.ejs");
})



//contact form
app.get("/contact", (req,res)=>{
  res.render("users/contact.ejs");
})

//Contact form Process
app.post("/contact", (req,res)=>{
const msg = { 
  to: `${confidential.email}`,
  from: 'noreply@mynotesapp.tk', 
  subject: 'Contact Form ',
  text: 'sometext',
  html: `<strong>MyNOTES got a new contact form.<br><br>
  Name: ${req.body.name}<br>
  Email: ${req.body.email}<br>
  Subject: ${req.body.subject}<br>
  Message: ${req.body.message}
  <br><br>Regards<br>Team MyNOTES</strong>`,
  };
  sgMail.send(msg);

            req.flash('success_msg', 'Your message has been successfully submitted');
            if(req.isAuthenticated())
            res.redirect('/notes');
            else
            res.redirect('/');

})



//Using Routes
app.use('/users', user);
app.use('/notes', note);



//Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`)); 
