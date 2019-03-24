module.exports ={
	logggedInAlready(req, res, next){
    if(req.isAuthenticated()){
       res.redirect('/notes');  
    }
    else
       return next();
    }
}
