const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const articleSchema = new mongoose.Schema({
	title: String,
	content: String
});

const Article = mongoose.model('Article', articleSchema);

////////////////// REQUESTS FOR ALL ARTICLES ///////////////////

app.route("/articles")
.get(function(req, res) {
	Article.find({}, function(err, results) {
		if (err) {
			res.send(err);
		} else {
			res.send(results);
		}
	});
})
.post(function(req, res) {
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content
	});

	newArticle.save(function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send("Successfully saved");
		}
	});
})
.delete(function(req, res) {
	Article.deleteMany({}, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send("Successfully deleted all articles");
		}
	});
});

////////////////// REQUESTS FOR A SPECIFIC ARTICLE ///////////////////

app.route("/articles/:articleName")
.get(function(req, res) {
	Article.findOne({title: req.params.articleName}, function(err, article) {
		if (err) {
			res.send(err);
		} else {
			if (article) {
				res.send(article);
			} else {
				res.send("No article with this title exists");
			}
		}
	});
})
.put(function(req, res) {
	Article.updateOne(
		{title: req.params.articleName}, //condition
		{title: req.body.title, content: req.body.content}, //updates
		function(err) {
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully updated article");
			}
		}
	);
})
.patch(function(req, res) {
	Article.updateOne(
		{title: req.params.articleName}, //condition
		{$set: req.body}, //updates
		function(err) {
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully updated article");
			}
		}
	);
})
.delete(function(req, res) {
	Article.deleteOne({title: req.params.articleName}, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.send("Successfully deleted article");
		}
	});
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
