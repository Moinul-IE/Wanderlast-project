const Listing = require("../models/listing");
const { listingSchema } = require("../joiSchema");
const ExpressError = require("../utiles/ExpressError");

module.exports.index = async(req, res, next)=>{

     
        const allListings =  await Listing.find({});
        res.render("listings/index", { allListings });  // "/ " it should not to be put 
        console.log("data was listings");
    
}

module.exports.new =  (req, res)=>{


    try {
        res.render("listings/createnew");

    } catch (error) {
        console.log(error);
    }
}

module.exports.createRoute = async(req, res) => {
     let result = listingSchema.validate(req.body);
     const newListing = new Listing(req.body.listing);
     // attach owner
     newListing.owner = req.user._id;
     // if an uploaded file exists (via multer + Cloudinary storage), save its url/filename
     if (req.file) {
       const url = req.file.path;
       const filename = req.file.filename;
       newListing.image = { url, filename };
     }
     // debug logs to help diagnose missing images
     console.log("[createRoute] req.file:", req.file);
     console.log("[createRoute] newListing before save:", newListing);
        // passport support save current user id and Bydefault need to set it 
        await newListing.save();
    console.log("[createRoute] saved listing:", newListing);
        req.flash("success", "Successfully created a new listing!");
        res.redirect("/listings");
    
}

module.exports.specificId = async (req, res, next) => {

    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
      if (!listing) {
        req.flash("error", "listing not exist!");
        res.redirect("/listings");
        // next(new ExpressError(404, "Listing not found"));
      }
      console.log(listing);
    res.render("listings/show", {listing});
}

module.exports.editListing = async (req, res) => {

    let {id} = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "listing not exist!");
        res.redirect("/listings");
      }
    // derive a safe original image URL (support both object {url,filename} and string forms)
    let orginalImageUrl = null;
    if (listing && listing.image) {
      if (typeof listing.image === 'string') {
        orginalImageUrl = listing.image;
      } else if (listing.image.url) {
        orginalImageUrl = listing.image.url;
      }
    }
    
    // if it's a Cloudinary URL, optionally add a small transformation for preview
    if (orginalImageUrl && orginalImageUrl.includes('/upload/')) {
      // insert transformation after '/upload/' -> '/upload/w_300,h_200/'
      orginalImageUrl = orginalImageUrl.replace('/upload/', '/upload/w_300,h_200/');
    }
    res.render("listings/edit", { listing, orginalImageUrl });
}

module.exports.updateRoute = async (req, res) => {  
  const { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid Data");
  }

  // update and return the new document
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // handle optional uploaded file (multer + cloudinary)
  if (req.file) {
    const url = req.file.path || req.file.url || req.file.secure_url;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Successfully updated listing!");
  return res.redirect(`/listings/${id}`);
};
// in industry level delete route always call is destory route 
module.exports.destoryRoute = async (req, res) => {
   let {id} = req.params;
   let deleteListings=  await Listing.findByIdAndDelete(id);
           req.flash("success", "Successfully delete listing!");

   console.log(deleteListings); 
   res.redirect("/listings");
}