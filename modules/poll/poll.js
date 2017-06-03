const express = require('express');
const router = express.Router();

const db = require('./models/pollDB.js');

const homeSiteURL = "portfolio/poll/";

// Helpers to find the views
const pollView = "poll/poll.ejs";
const resultsView = "poll/results.ejs";
const pollListView = "poll/poll-list.ejs";

router.get('/', function(req, res, next) { 
	db.getPolls(function(err, docs) {
		res.render(pollListView, {
			title : "Poll - Portfolio",
			polls: docs,
		});
	});
});

// Check that the ID is valid and store the poll if it is
router.param('id', function(req, res, next, id) {
	if (!(id.length < 24 || id.length > 24)) {
		db.getPoll(req.params.id, function(err, doc){
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

		console.log(res.poll.duplicationCheck);

		var duplicationCheck = res.poll.duplicationCheck;
		var check = "None";

		if (duplicationCheck == "IPCheck")
			check = "IP Checking";

		res.render(pollView, {
			title : "Poll - Portfolio",
			pollID: id,
			submitURL : homeSiteURL + "api/" + id + "/submit",
			duplicationCheck: check,
			poll : res.poll
		});
	} else {
		next();
	}
});

// Get the results of the poll
router.get('/:id/results', function(req, res, next) {
	var pollID = req.params.id;
	db.getResults(pollID, function(err, results){
		if (err)
			console.log(err);

		res.render(resultsView, {
			title : "Survey - Portfolio",
			pollID : pollID,
			results : results
		});
	});
});

module.exports = router;