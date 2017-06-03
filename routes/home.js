const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	res.render('main/home', {
		title : "Curtis Fulton - Home Page",
		activePage : "Home"
	});
});

module.exports = router;