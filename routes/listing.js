const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, error);
    }else {
        next();
    }
};

// index route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create route
router.post("/", validateListing ,wrapAsync(async (req, res, next) => {
       let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
  }));

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs", { listing });
}));


// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    };
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.patch("/:id", validateListing ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated successfully");
    res.redirect(`/listings/${id}`); // Redirect to updated listing page
  }));


// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
}));


module.exports = router;