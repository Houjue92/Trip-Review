var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local")
    
//seedDB();  

mongoose.connect("mongodb://localhost:27017/yelp_camp_V5",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

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

app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campgrounds",function(req,res) {
    
    Campground.find({},function(err,AllCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:AllCampgrounds,currentUser: req.user});    
        }
    });
    
    
});

app.post("/campgrounds",function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image,description:description};
    Campground.create(newCampground,function(err,newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect defaulty goes to GET
            res.redirect("/campgrounds");    
        }
    });
    
});

app.get("/campgrounds/new",function(req,res) {
    
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});    
        }
    });
});

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new",{campground: campground});    
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
            console.log(req.body.comment);
            // res.render("comments/new",{campground: campground});    
        }
    });
});

//Auth routes
//show reister form
app.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login",function(req,res){
    res.render("login");
});
//handling login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
});

//logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");   
}

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("The YelpCamp server has started!");
});