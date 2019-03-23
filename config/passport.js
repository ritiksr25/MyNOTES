//Import Modules
const passport=require("passport");
const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Import Model
const User = mongoose.model('users');

//Definition -passport
module.exports = (passport)=>{
  passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
    User.findOne({username:username}).then(user => {
      if(!user){
        return done(null, false, {message: 'User not Found'});
      } 
     bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
           return done(null, user);
        } else {
          return done(null, false, {message: 'Bad Credentials'});
        }
      })
    })
  }));

  passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  });
}
