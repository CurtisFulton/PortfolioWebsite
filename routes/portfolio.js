const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');

// Create all the custom routes found in the subroute directory
const subrouteDir = path.join(__dirname, 'subroutes/');
fs.readdir(subrouteDir, function(err, files) {
	files.forEach(function(file) {
		try {
			if (path.extname(file) != '.js') {
				console.log("File in subroutes is not .js");
			}

			var routeName = path.basename(file, '.js'); // Remove the .js Extention
			var customRoute = require(subrouteDir + routeName);
			
			router.use('/' + routeName, customRoute);
			console.log("Created custom route for " + routeName);
		} catch (err) {
			console.log("This was most likely caused because there is a folder in the subroutes folder");
			console.log(err);
		}
	});
});


// Default portfolio page
router.get('/', function(req, res, next) {
	res.render('main/portfolio', {
		title : "Curtis Fulton - Portfolio",
		activePage : "Portfolio"
	});
});

module.exports = router;