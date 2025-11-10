const fs = require("fs");
const path = require("path");
console.log("Current directory:", __dirname);
try {
    console.log("Files in root:", fs.readdirSync(__dirname));
} catch (e) {
    console.log("Could not read root directory:", e.message);
}
try {
    console.log("Files in routers folder:", fs.existsSync(path.join(__dirname, "routers")) ? fs.readdirSync(path.join(__dirname, "routers")) : "Routers folder missing");
} catch (e) {
    console.log("Could not read routers directory:", e.message);
}




if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const Router = require("./routers/listings");
const reviewRouter = require("./routers/review");
const userRouter = require("./routers/user");
const ExpressError = require("./utiles/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user");
const {isLoggedin} = require("./middlware");

// const Mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";
const Adb_url = process.env.Atlas_DB;


async function main() {
        await mongoose.connect(Adb_url);
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);
        });
    
};
    
// main().then((err) => {
//     console.log("connected to MongoDB")});
main().catch((err)=>{
    console.log(err);
});
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


// session in online at Mongo Atlas: session save in also atlas by connect mongo
const store = MongoStore.create({
    mongoUrl:Adb_url,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600    
});

// if have error in session 
store.on("error", (err) =>{
    console.log("Error in Mongo Session store:", err);
});

if (!Adb_url) {
    console.warn('[app] Warning: Atlas_DB environment variable is not set. MongoDB connection may fail.');
}


// session option use 
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie cross-site scripting (XSS) attacks
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }

};
app.use(session(sessionOption));
app.use(flash());

// always use after session 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res)=>{
//     res.send("i am no root");
//    console.log(" server is connected ");
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// demo passport using
// app.get("/demouser", async (req, res)=>{
//       let fakeUser = new User({
//         email: "student1@gmail.com",
//         username: "dalta-stu",
//       });

//      let registerUser = await User.register(fakeUser, "hello");
//      res.send(registerUser);
// });

app.use("/listings", Router);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) =>{
    console.log(err);
    const {status= 500, message ="somthing wrong"} = err;
    res.status(status).render("listings/Error", {message});
});


