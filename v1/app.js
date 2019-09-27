var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgrounds = [
        {name:"Salmon Greek",image:"https://farm1.nzstatic.com/_proxy/imageproxy_1y/serve/camping-abel-tasman-national-park.jpg?focalpointx=50&focalpointy=50&height=240&outputformat=jpg&quality=75&source=4544603&transformationsystem=focalpointcrop&width=480&securitytoken=7C45E1EAC5E93000FC90598F72776A52"},
        {name:"Granite Hill",image:"https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_large/public/images/18/06/gettyimages-649155058.jpg?itok=Lhx5ciAR"},
        {name:"Mountain Goat",image:"https://grist.files.wordpress.com/2017/05/tent-campsite-by-river.jpg?w=1024&h=576&crop=1"},
        {name:"Mountain Goat",image:"https://grist.files.wordpress.com/2017/05/tent-campsite-by-river.jpg?w=1024&h=576&crop=1"},
        {name:"Granite Hill",image:"https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_large/public/images/18/06/gettyimages-649155058.jpg?itok=Lhx5ciAR"},
        {name:"Salmon Greek",image:"https://farm1.nzstatic.com/_proxy/imageproxy_1y/serve/camping-abel-tasman-national-park.jpg?focalpointx=50&focalpointy=50&height=240&outputformat=jpg&quality=75&source=4544603&transformationsystem=focalpointcrop&width=480&securitytoken=7C45E1EAC5E93000FC90598F72776A52"},
        {name:"Mountain Goat",image:"https://grist.files.wordpress.com/2017/05/tent-campsite-by-river.jpg?w=1024&h=576&crop=1"}
    ]

app.get("/",function(req,res) {
    res.render("landing");
});

app.get("/campground",function(req,res) {
    
    
    res.render("campground",{campgrounds:campgrounds});
});

app.post("/campground",function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect defaulty goes to GET
    res.redirect("/campground");
});

app.get("/campground/new",function(req,res) {
    
    res.render("new");
});

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("The YelpCamp server has started!");
});