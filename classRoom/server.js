const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: true
};

app.use( session(sessionOptions) );
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {

    let { name = "anonymus" } = req.query;
    req.session.name = name;

    if(name === "anonymus"){
        req.flash("error", "user is not register successfully");
    }else{
        req.flash("success", "user register successfully");
    };

    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});

// app.get("/reqcount", (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1
//     };
//     res.send(`you send req ${req.session.count} times` );
// });

app.get("/test", (req, res) => {
    res.send("test successful");
});


app.listen(3000, (req, res) => {
    console.log("Port is listening to 3000");
});