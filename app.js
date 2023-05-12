const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser:true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema )

// app.get("/articles", function(req, res){
//   Article.find(function(err, foundArticles){
//     if(!err){
//         res.send(foundArticles);
//     }else {
//       res.send(err);
//     }
//   });
// });
// app.post("/articles", function(req, res){
//   const jackBauer = new Article({
//     title:req.body.title,
//     content:req.body.content
//   });
//   //inside our save method we can adda callback funtion that will triger incase of any errors
//   jackBauer.save(function(err){
//     if(!err){
//       res.send("succesfully added the article");
//     }else{
//       res.send(err);
//     }
//   });
// });
// app.delete("/articles", function(req, res){
//   Article.deleteMany(function(err){
//     if(!err){
//       res.send("Succesfully deleted all articles")
//     } else{
//       res.send(err);
//     }
//   });
// });

//refactoring above code and using app.route() express method
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }else {
      res.send(err);
    }
  });
})
.post(function(req, res){
  const jackBauer = new Article({
    title:req.body.title,
    content:req.body.content
  });
  //inside our save method we can adda callback funtion that will triger incase of any errors
  jackBauer.save(function(err){
    if(!err){
      res.send("succesfully added the article");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all articles")
    } else{
      res.send(err);
    }
  });
});



//////////////////////////////////////////////////////////////////// targetting spcific articles/////////////////////////////////////////


app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No artcles found");
    }
  });
})

.put(function(req, res){
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    //{overwrite:true},
    function(err){
     if (!err){
       res.send("Sucessfully updated!")
     }
   });
})
//patch combines use of updateOne and atomic opertaor $set === {$set: {field:value, ..}};
.patch(function(req, res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: {content:req.body.content}},
    {overwrite:true},
    function(err){
     if (!err){
       res.send("Sucessfully updated!")
     }
   });
})
.delete(function(req, res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
    if (!err){
      res.send("Successfully deleted all documents");
    }else{
      res.send(err);
    }
  });
});


//.post
// const DOM = new Article({
//   title: "Dom",
//   content: "When a web page is loaded, the browser creates a Document Object Model of the page.The HTML DOM model is constructed as a tree of Objects:"
// });

//const articlesArray = [DOM]
//DOM.save();
//console.log(DOM);

// const categorySchema = new mongoose.Schema({
//   writer: String,
//   Article:articleSchema
// });
//
// const Category = mongoose.model("Category",categorySchema )
//
// const technology = new Category({
//   writer:"John Doe",
//   Article: DOM
// });
//technology.save();



// app.get("/", function(req, res){
//   res.render("articles", {})
// });
// app.post("/addArticle", function(req, res){
//   const articleTopic = req.body.addTopic;
//   const articleContent = req.body.addContent;
//
//   const newArticle = new Article({
//     title: articleTopic,
//     content:articleContent
//   });


  //newArticle.save();
  //console.log(newArticle);
//});
app.listen(3000, function(){
  console.log("Server running on port 3000")
});
