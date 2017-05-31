const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	res.render('main/aboutme', {
		title : "Curtis Fulton - About Me",
		activePage : "AboutMe"
	});
});

module.exports = router;