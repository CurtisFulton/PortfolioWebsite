const express = require('express');
const router = express.Router();

var portfolios = require('../data/portfolios.json');

// Add custom routers for portfolios
// This allows for custom logic to be run for each site
for (var i = 0; i < portfolios.length; i++) {
	var portfolio = portfolios[i];

	//Get custom router
	var customRouter;
	try {
		customRouter = require(portfolio.customRouter);
		console.log("Using custom router for /portfolio/" + portfolio.portfolioTitle);
		router.use("/" + portfolio.portfolioTitle, customRouter);
	} catch (ex) {
		console.log("Could not find router " + portfolio.customRouter);
		console.log(ex);
	}
}


// Default portfolio page
router.get('/', function(req, res, next) {
	res.render('main/portfolio', {
		title : "Curtis Fulton - Portfolio",
		activePage : "Portfolio"
	});
});

module.exports = router;