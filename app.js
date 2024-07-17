const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
    .then((res) => {
        console.log("connected to db");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


// Root route
app.get("/", (req, res) => {
    res.send("root is working");
});


// index route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body.listing);
    console.log(result);
       let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }));

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));


// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update route
app.patch("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); // Redirect to updated listing page
  }));


// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));


// app.get("/testlisting", async(req,res) => {
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description: "mountain views",
//         price: 1200,
//         location: "goa",
//         country: "india",
//     });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful test");
// })


// For unidentified routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


// Error handlling middleware
app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to the port 8080");
});