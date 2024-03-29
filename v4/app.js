var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    // User = require("./models/user"),
    seedDB = require("./seeds")
    
// seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp_V4",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");



app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campgrounds",function(req,res) {
    Campground.find({},function(err,AllCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:AllCampgrounds});    
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

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new",{campground: campground});    
        }
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
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

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("The YelpCamp server has started!");
});