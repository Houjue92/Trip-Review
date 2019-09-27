var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp_V2",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create({
//     name:"Granite hill",
//     image:"http://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg",
//     description:"This is huge"      
// },function(err,campground) {
//     if(err) {
//         console.log("Error");
//         console.log(err);
//     } else {
//         console.log("newly created campground");
//         console.log(campground);
//     }
// });

app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campgrounds",function(req,res) {
    Campground.find({},function(err,AllCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("index",{campgrounds:AllCampgrounds});    
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
    
    res.render("new");
});

app.get("/campgrounds/:id",function(req,res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            
            res.render("show",{campground:foundCampground});    
        }
    });
    
    
});

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("The YelpCamp server has started!");
});