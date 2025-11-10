const express = require("express");
const router = express.Router(); 
const User = require("../models/user");
const wrapAsync = require("../utiles/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middlware");
const userController = require("../controller/user");


// const passport = require("passport-local")
router.get("/logout", wrapAsync(userController.logoutUser));
// here is all router 
router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signupUser
));



router.route("/login")
.get( userController.renderLoginForm)
.post( 
saveredirectUrl, passport.authenticate("local", {failureRedirect: "/login",
    failureFlash: true,
}),
userController.loginUser);






module.exports = router;
