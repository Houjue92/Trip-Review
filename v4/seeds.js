var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")
var data = [
    {   name:"Cloud's Rest",
        image:"https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description:"balh blah bhla"
    },
    {   name:"Desert Mesa",
        image:"https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description:"balh blah bhla"
    },
    {   name:"Canyon Floor",
        image:"https://images.pexels.com/photos/756780/pexels-photo-756780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description:"balh blah bhla"
    }
]
function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed campground!");
            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("data added");
                        Comment.create(
                            {
                                text:"This palce is great, but Iwant wifi",
                                author:"Houjue"
                            }, function(err,comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }       
                });    
            });
        }
    });
    // add a few cmpgrounds
    
    
}

module.exports = seedDB;
