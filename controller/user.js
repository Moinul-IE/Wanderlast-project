const User = require("../models/user"); 


module.exports.renderSignupForm = (req, res)=>{
  res.render("users/signup");
}

module.exports.signupUser = async (req, res, next) => {

    try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email});
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "welcome to wanderLust");
    res.redirect("/listings");
    })
    
    } catch (error) {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("/signup");
        
    }
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login");

}

module.exports.loginUser = async(req, res)=>{
    req.flash("success", "your are login in wonderLust");
    let redirect = res.locals.saveredirectUrl || "/listings";

    res.redirect(redirect);
}

module.exports.logoutUser = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err)
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
}