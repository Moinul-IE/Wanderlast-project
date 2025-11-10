const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to params from parent route
const wrapAsync = require("../utiles/wrapAsync")
const ExpressError = require("../utiles/ExpressError");
const { listingSchema, revivewSchema } = require("../joiSchema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedin } = require("../middlware");

const reviewController = require("../controller/review.js");

 const validateReview = (req, res, next) => {
    console.log("Review body:", req.body); // Add this
    let { error } = revivewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400, errMsg));
    } else{
        next();
    }
}

router.post("/", validateReview, isLoggedin, wrapAsync( reviewController.createReview));


router.delete("/:reviewId", isLoggedin, wrapAsync(reviewController.deleteReview));


module.exports = router;