const express = require('express');
const router = express.Router();

const db = require('./pollDB.js');

// Create the poll and add it to the database
router.post('/create-poll', function(req, res, next) {
	var validPoll = createPoll(req);

	if (validPoll.err) {
		res.render('home', {
			title : "Poll - Portfolio",
			errors: validPoll.err
		});
	} else {
		db.addPoll(validPoll.poll, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				var redirectURL = "/polls/" + result._id;
				res.redirect(redirectURL);
			}
		});
	}
});

// Add result to the database
router.post('/:id/submit', function(req, res, next) {
	var id = req.params.id;

	db.getPoll(id, function(err, doc){
		if (err)
			console.log(err);

		var dupCheck = doc.duplicationCheck;

		var ip = req.headers['x-forwarded-for'] || 
			req.connection.remoteAddress || 
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress

		var pollResults = req.body.pollAnswers;
		// Make sure the poll results are an array (even if it is only 1 big)
	    if (!(pollResults.constructor === Array)) {
	    	pollResults = [pollResults];
	    }

	    // Construct the result object
		var result = {
			pollID: id,
			ip: ip,
			answers: pollResults
		}

		db.validateResult(result, dupCheck, function(err) {
			var redirectURL = "/polls/" + id + "/results";

			if (!err) {
				db.addResult(result, function(err, result) {
					if (err)
						console.log(err);

					res.redirect(redirectURL);
				})
			} else {
				res.redirect(redirectURL);
			}

		});
	});
});

module.exports = router;


function createPoll(req) {
	var pollQuestion = req.body.pollquestion;
	var pollOptions = req.body.polloption;
	var multiSelect = req.body.multiSelect;
	var duplicationCheck = req.body.duplicationCheck;

	req.checkBody('pollquestion', 'Question is required').notEmpty();
	req.checkBody('polloption', 'Must have at least 2 poll options').validStrings(2);

	var err = req.validationErrors();

	if (!err) {
		for (var i = 0; i < pollOptions.length; i++) {
			if (pollOptions[i] == null || pollOptions[i].length == 0) {         
		  		pollOptions.splice(i, 1);
		  		i--;
			}
		}

		var poll = {
			question: pollQuestion,
			pollOptions: pollOptions,
			duplicationCheck: duplicationCheck
		};

		if (multiSelect)
			newPoll.multiSelect = true;
	} 
	return { err, poll };
}