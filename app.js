var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"); //listen to _method

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {  //takes current date as defualt.
        type: Date, 
        default: Date.now
        
    }
});
var Blog = mongoose.model("Blog", blogSchema);


//===========================
//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});
    //INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

    //NEW/CREATE ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});

    //Create a post blog
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    });
    //redirect to the index
});


    //SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show", {blog: foundBlog});
       }
    });
});

    //EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blogs:foundBlog}); //use in the edit page
        }
    });
 
});
    //UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect(".blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

    //Delete Route
app.delete("/blogs/:id", function(req, res){
    //destory blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    //redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started!");
});