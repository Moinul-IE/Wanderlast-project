const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

const Mongo_URL = ("mongodb://127.0.0.1:27017/wanderLust");

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(Mongo_URL);
    
}
// to take data from request body using middleware 

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
// to use fontawesome 
app.use('/css', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/css')));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts')));


app.set("view engine", "ejs") // for ejs template
app.set("views", path.join(__dirname, "views")); // views folder finding from any where 
app.engine("ejs", ejsMate);

app.get("/", (req, res)=>{
    res.send("i am no root")
   console.log(" server is connected ");
})

// GET  request  /listings to show alllistings

app.get("/listings", async (req, res)=>{
     try {
        const allListings =  await Listing.find({});
        res.render("listings/index", {allListings});  // "/ " it should not to be put 
        console.log("data was listings");
     } catch (error) {
        console.log(error);
        console.log("data was not listings");
     }
});



app.get("/listings/new", (req, res)=>{
    try {
        res.render("listings/createnew");

    } catch (error) {
        console.log(error);
    }
});



// GET REQ FOR SPECIFIC ID REQ 
app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});


// create route
app.post("/listings", async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    try {
        await newListing.save();
        res.redirect("/listings");
    } catch (error) {
        console.log(error);
    }
});

// edit fet route
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});

// now update route
app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

 // delete route
app.delete("/listings/:id", async (req, res)=>{
   let {id} = req.params;
   let deleteListings=  await Listing.findByIdAndDelete(id);
   console.log(deleteListings);
   res.redirect("/listings");
})

app.listen(8080, (req, res)=>{
    console.log("server is listening to port 8080");
});