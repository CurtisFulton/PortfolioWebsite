const express = require('express');
const router = express.Router();

// Routers
const apiRouter = require('./poll-api.js');
const pollRouter = require('./poll.js');

const homeView = "poll/home.ejs";
const homeSiteURL = "portfolio/poll/";

// Default portfolio page
router.get('/', function(req, res, next) {
	res.render(homeView, {
		title : "Poll - Portfolio",
		portfolioHome : homeSiteURL
	});
});

router.use('/api', apiRouter);
router.use('/polls', pollRouter);

module.exports = router;