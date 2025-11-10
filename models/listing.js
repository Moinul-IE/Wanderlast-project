// mongoose schema require &  Schema define for Schema 

const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review = require("./review");

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
        url: String,
        filename: String,
      },






    price : {
        type: Number,

    },
    location : {
        type: String,

    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

