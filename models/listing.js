// mongoose schema require &  Schema define for Schema 

const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const  listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        
    }, 

    // image: {
    //     type: {
    //         filename: { type: String, default: "listingimage" },
    //         url: {
    //             type: String,
    //             default: "https://s.yimg.com/os/creatr-uploaded-images/2022-05/101cc060-dfe4-11ec-bfbb-f72923bebd3a",
    //             set: (v) => (v === "") ? "https://s.yimg.com/os/creatr-uploaded-images/2022-05/101cc060-dfe4-11ec-bfbb-f72923bebd3a" : v,
    //         },
    //     },
    //     default: {},
    // },

    image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) =>
          v === ""
            ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : v,
      },






    price : {
        type: Number,

    },
    location : {
        type: String,

    },
    country: {
        type: String,
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

