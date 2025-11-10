const Listing = require("./models/listing");

module.exports.isLoggedin = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "please Log in ");
        return res.redirect("/login");
    }

    return next();
};

module.exports.saveredirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.saveredirectUrl = req.session.redirectUrl;
    }
    next();
    
};

module.exports.isOwner = async  (req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }
    // ensure there is a logged-in user
    const user = req.user || res.locals.currUser;
    if (!user) {
        req.flash("error", "You must be logged in");
        return res.redirect('/login');
    }
    const ownerId = listing.owner && (listing.owner._id ? listing.owner._id.toString() : listing.owner.toString());
    if (ownerId !== user._id.toString()) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    return next();
}