const User = require('../models/User');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.createUser = async (req,res)=>{
    try{
    const{email,username,password}= req.body
    const user = new User({email,username})
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
      if(err) return next(err);
      req.flash('success','Welcome to YelpCamp')
      res.redirect('/campgrounds')
     })
   
    }catch(err){
        req.flash('error',err.message);
        res.redirect('register')
    }
}

module.exports.renderLoginForm = async (req,res)=>{
    res.render('users/login')
  }

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
  }

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}