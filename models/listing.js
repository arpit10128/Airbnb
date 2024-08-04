
const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default:"https://images.unsplash.com/photo-1720180320321-2a3d719d14f8?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1720180320321-2a3d719d14f8?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

listingSchema.post("findOneAndDelete", async(listing) => {
   if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews }});
   }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;