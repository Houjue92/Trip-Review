var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")
    
var commentsRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")
    
// seedDB();  

mongoose.connect("mongodb://localhost:27017/yelp_camp_V10",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT Configuration
app.use(require("express-session")({
    secret: "Again, I like play Soccer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("The YelpCamp server has started!");
});