//Authentication Check
module.exports = {
	isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'You must be Logged in...');
    res.redirect('/users/login');
  }
}


