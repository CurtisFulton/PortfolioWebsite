const mongojs = require('mongojs');
const db = mongojs('poll', ['polls', 'results']);


exports.getPolls = function(callback) {
	db.polls.find(callback);
}

exports.getPoll = function(id, callback) {
	db.polls.findOne({ _id: mongojs.ObjectId(id) }, callback);
}

exports.addPoll = function(poll, callback) {
	db.polls.insert(poll, callback);
}

exports.getResults = function(id, callback) {
	db.results.aggregate([  
		{ $match: { pollID: id } },   
		{ $unwind: "$answers" },   
		{ $group: { _id: "$answers", count: { $sum:1 } } }  
	], callback);
}

exports.validateResult = function(result, duplicationCheck, callback) {
	let id = result.pollID;
	let ip = result.ip;

    let query = { pollID: id, answerIP: ip };

    if (duplicationCheck != "None"){
    	let query = {};
    	if (duplicationCheck == "IPCheck") {
	    	query = { pollID: id, answerIP: ip };
    	} 

	    db.results.findOne(query, function(err, doc) {
	    	if (err)
	    		callback(err);
	    	else {
		    	if (doc) {
		    		callback(new Error('Already Voted'));
		    	} else {
		    		callback(null);
		    	}
		    }
	    });
    } else {
    	callback(null);
    }
}

exports.addResult = function(result, callback) {
	db.results.insert(result, callback);
}