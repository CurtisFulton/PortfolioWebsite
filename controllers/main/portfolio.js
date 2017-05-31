const express = require('express');
const router = express.Router();
const path = require('path');

// Create all the custom routes found in the subroute directory
const dynamicControllers = require('../../dynamic-controllers.json');
const basePath = path.join(__dirname, '../');

dynamicControllers.forEach(function(controllerInfo) {
	let localURL = controllerInfo.localURL;
	let localPath = controllerInfo.localPath;
	let entryFile = controllerInfo.entryFile;

	let controller = require(basePath + localPath + entryFile);

	router.use(localURL, controller);
	console.log("Created dynamic controller for '" + localURL + "' using '" + entryFile + "' as the entry file");
});


// Default portfolio page
router.get('/', function(req, res, next) {
	res.render('main/portfolio', {
		title : "Curtis Fulton - Portfolio",
		activePage : "Portfolio",
		portfolios: dynamicControllers
	});
});

module.exports = router;