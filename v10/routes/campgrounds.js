var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

function checkCampgroundOwnership(req,res,next) {
    if(req.isAuthenticated()) {
        
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            } else {
                //does the user own the campground
                if(foundCampground.author.id.equals(req.params._id)) {
                    next();    
                } else {
                    res.redirect("back");
                }
            }
        });    
    } else {
        res.redirect("back");
    }    
}

router.get("/",function(req,res) {
    
    Campground.find({},function(err,AllCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:AllCampgrounds,currentUser: req.user});    
        }
    });
    
    
});

router.post("/",isLoggedIn,function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image,description:description, author: author};
    
    Campground.create(newCampground,function(err,newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect defaulty goes to GET
            res.redirect("/campgrounds");    
        }
    });
    
});

router.get("/new",middleware.isLoggedIn,function(req,res) {
    
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});    
        }
    });
});

//Edit campgroud route
router.get("/:id/edit",function(req,res){
    if(req.isAuthenticated()) {
        
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("/campgrounds");
            } else {
                //does the user own the campground
                
                if(foundCampground.author.id.equals(req.user._id)) {
                    res.render("campgrounds/edit",{campground: foundCampground});    
                } else {
                    res.send("You do need have permission")
                }
            }
        });    
    } else {
        console.log("You need to be logged in to do that!");
        res.send("You need to be logged in to do that!");
    }
    
    
});
//Update campgroud route

router.put("/:id",function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campgroud route
router.delete("/:id",function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds")
        }
    });    
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");   
}

module.exports = router;var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");

router.get("/",function(req,res) {
    
    Campground.find({},function(err,AllCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:AllCampgrounds,currentUser: req.user});    
        }
    });
    
    
});

router.post("/",middleware.isLoggedIn,function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image,description:description, author: author};
    
    Campground.create(newCampground,function(err,newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect defaulty goes to GET
            res.redirect("/campgrounds");    
        }
    });
    
});

router.get("/new",middleware.isLoggedIn,function(req,res) {
    
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});    
        }
    });
});

//Edit campgroud route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res) {
    Campground.findById(req.params.id,function(err,foundCampground){    
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});
//Update campgroud route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campgroud route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            res.redirect("/campgrounds")
        } else{
            res.redirect("/campgrounds")
        }
    });    
});



module.exports = router;