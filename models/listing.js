const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        default: "https://images.unsplash.com/photo-1519865885898-a54a6f2c7eea?q=80&w=1958&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === ""? "https://unsplash.com/photos/an-abstract-image-of-a-white-object-with-a-gray-background-Hp-KRSsV4H0": v,
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
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;