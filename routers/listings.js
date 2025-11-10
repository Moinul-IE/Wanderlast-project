const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utiles/wrapAsync")
const ExpressError = require("../utiles/ExpressError");
const { listingSchema, revivewSchema } = require("../joiSchema");
const Review = require("../models/review");
const { isLoggedin, isOwner } = require("../middlware");
const ListingController = require("../controller/listings.js");

const multer  = require('multer');
const { storage} = require("../cloudconfig");
const upload = multer({ storage })

 
// middleware to validate listing data
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400, errMsg));

    }else {
        next();
    }
}

router
 .route("/")
 .get( wrapAsync(ListingController.index))
 .post( isLoggedin, upload.single('listing[image]'), validateListing,   wrapAsync(ListingController.createRoute));

 // need to put here because it will be count with id param
 
router.get("/new", isLoggedin, ListingController.new);

router
.route("/:id")
// GET REQ FOR SPECIFIC ID REQ 
 .get( wrapAsync(ListingController.specificId))
 // now update route // no need semicolon here 
 .put( isLoggedin, isOwner, upload.single('listing[image]'), validateListing,
     wrapAsync(ListingController.updateRoute))
 .delete( isLoggedin,  wrapAsync(ListingController.destoryRoute));






// create route






router.get("/:id/edit", isLoggedin, wrapAsync(ListingController.editListing));











module.exports = router;