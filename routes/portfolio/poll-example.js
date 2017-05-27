const express = require('express');
const router = express.Router();

const mongojs = require('mongojs');
const db = mongojs('poll', ['polls']);

const pollHome = "portfolio/poll-example";

// Default portfolio page
router.get('/', function(req, res, next) {
	res.render('portfolios/poll-example/home', {
		title : "Survey - Portfolio",
		activePage : "Portfolio",
		portfolioHome : pollHome
	});
});

// Create the poll and add it to the database
router.post('/api/create-poll', function(req, res, next) {

	var pollQuestion = req.body.pollquestion;
	var pollOptions = req.body.polloption;

	req.checkBody('pollquestion', 'Question is required').notEmpty();
	req.checkBody('polloption', 'Must have at least 2 poll options').validStrings(2);

	var errors = req.validationErrors();

	if (errors){
		res.render('portfolios/poll-example/home', {
			title : "Survey - Portfolio",
			activePage : "Portfolio",
			portfolioHome : pollHome,
			errors: errors
		});
	} else {
		// Remove any empty strings from the poll options
		for (var i = 0; i < pollOptions.length; i++) {
			if (pollOptions[i] == null || pollOptions[i].length == 1) {         
		  		pollOptions.splice(i, 1);
		  		i--;
			}
		}

		var newPoll = {
			question: pollQuestion,
			pollOptions: pollOptions
		};

		db.polls.insert(newPoll, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				var redirectURL = '/' + pollHome + '/' + result._id;
				console.log('redirecting to ' + redirectURL);

				res.redirect(redirectURL);
			}
		});
	}
});

router.get('/polls', function(req, res, next) { 
	db.polls.find(function(err, docs) {
		console.log(docs);
		res.json(docs);
	});
});

// Check that the ID is valid and store the poll if it is
router.param('id', function(req, res, next, id) {
	if (id.length < 24 || id.length > 24){
		res.status(404).end("404: Not a valid poll");
	} else {
		db.polls.findOne({
			_id: mongojs.ObjectId(req.params.id)
		}, function(err, doc){
			if (doc == null){
				res.status(404).end("404: Poll not found");
			} else {
				res.poll = doc;
				next();
			}
		});
	}
});

// Render the Poll 
router.get('/:id', function(req, res, next) {
	res.render('portfolios/poll-example/poll', {
		title : "Survey - Portfolio",
		activePage : "Portfolio",
		poll : res.poll
	});
});

// Display the results
router.get('/:id/results', function(req, res, next) {
	console.log("test");
});

module.exports = router;