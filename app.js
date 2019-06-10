const express = require('express');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

//Setting Express middleware
const app = express();

//Setting Up Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Flash and user variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Import Configurations
require('./config/passport')(passport);
require('./config/dbconnection');

//load models
const User = require('./models/User');
const Note = require('./models/Note');

//Using Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/notes', require('./routes/notes'));

//setting up server
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) console.log('Error in running Server.');
  else console.log(`Server is up and running on Port ${PORT}`);
});