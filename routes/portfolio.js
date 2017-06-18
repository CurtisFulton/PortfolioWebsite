const express = require('express');
const router = express.Router();
const path = require('path');

// Create all the custom routes found in the subroute directory
const modules = require('../dynamic-controllers.json');

//loadModules(modules);

// Default portfolio page
router.get('/', function(req, res, next) {
	res.render('main/portfolio', {
		title : "Curtis Fulton - Portfolio",
		activePage : "Portfolio",
		portfolios: modules
	});
});

module.exports = router;

function loadModules(modules) {
	let basePath = "../modules/"

	modules.forEach(function(controllerInfo) {
		let localURL = controllerInfo.localURL;
		let localPath = controllerInfo.localPath;
		let entryFile = controllerInfo.entryFile;

		let controller = require(basePath + localPath + entryFile);

		router.use(localURL, controller);
		console.log("Created dynamic controller for '" + localURL + "' using '" + entryFile + "' as the entry file");
	});
}