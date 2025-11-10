const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(Mongo_URL);
    
};

const  initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj,
        owner: "68c2622b689fcf5acf85073b"
    }));// if have any data need to delete 
    await Listing.insertMany(initData.data); 
    console.log("data is saved");
};

initDB();