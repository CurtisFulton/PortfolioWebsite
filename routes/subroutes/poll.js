const express = require('express');
const router = express.Router();

const mongojs = require('mongojs');
const db = mongojs('poll', ['polls', 'results']);

const homeSiteURL = "portfolio/poll/";

// Helpers to find the views
const routeViews = "subsites/poll-site/";
const homeView = routeViews + "home";
const pollView = routeViews + "poll";

// Default portfolio page
router.get('/', function(req, res, next) {
	res.render(routeViews + 'home', {
		title : "Poll - Portfolio",
		activePage : "Portfolio",
		portfolioHome : homeSiteURL
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
		res.render(routeViews + 'home', {
			title : "Survey - Portfolio",
			activePage : "Portfolio",
			portfolioHome : homeSiteURL,
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
				var redirectURL = '/' + homeSiteURL + result._id;
				console.log('redirecting to ' + redirectURL);

				res.redirect(redirectURL);
			}
		});
	}
});

router.get('/polls', function(req, res, next) { 
	db.polls.find(function(err, docs) {
		res.json(docs);
	});
});

// Check that the ID is valid and store the poll if it is
router.param('id', function(req, res, next, id) {
	if (!(id.length < 24 || id.length > 24)) {
		db.polls.findOne({
			_id: mongojs.ObjectId(req.params.id)
		}, function(err, doc){
			if (err)
				console.log(err);
			res.poll = doc;
			next();
		});
	} else {
		next();
	}
});

// Render the Poll 
router.get('/:id', function(req, res, next) {
	if (res.poll) {
		var id = req.params.id;
		res.render(routeViews + 'poll', {
			title : "Survey - Portfolio",
			activePage : "Portfolio",
			pollID: id,
			submitURL : homeSiteURL + "api/" + id + "/submit",
			poll : res.poll
		});
	} else {
		next();
	}
});

// Add result to the database
router.post('/api/:id/submit', function(req, res, next) {
	var id = req.params.id;

	var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress

	var answer = {
		pollID: id,
		answerIP: ip,
		answers: req.body.pollAnswers
	}

	db.results.insert(answer, function(err, result) {
		if (err)
			console.log(err);

		console.log('Successfully inserted result');
		var redirectURL = '/' + homeSiteURL + id + "/results";
		res.redirect(redirectURL);
	});
});

// Get the results of the poll
router.get('/:id/results', function(req, res, next) {
	var pollID = req.params.id;
	db.results.aggregate([
		{ $match: {pollID:pollID} }, 
		{ $group: { _id: "$answers", count: {$sum:1} } }
	], function(err, result) {
		if (err)
			console.log(err);

		res.render(routeViews + 'results', {
			title : "Survey - Portfolio",
			activePage : "Portfolio",
			pollID : pollID,
			results : result
		});
	});

});

module.exports = router;