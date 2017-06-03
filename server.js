const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validator = require('validator');

const port = 8080;
const app = express();

// View engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Global Vars
app.use(function(req, res, next) {
	res.locals.errors = null;
	next();
});



// Main Controllers
const home = require('./routes/home');
const portfolio = require('./routes/portfolio');

app.use('/', home);
app.use('/portfolio', portfolio);


// 500 Error
app.use(function(err, req, res, next) {
	res.status(500).send("500: Internal Server Error");
	console.log(err);
});

// 500 Error
app.use(function(req, res) {
	res.status(404).send("404: Page not found");
});

// Start Server
app.listen(port, function() {
	console.log('Server Online. Port: ' + port);
});


function loadMiddleware() {
	// Express Validator
	app.use(expressValidator({
	  errorFormatter: function(param, msg, value) {
	      var namespace = param.split('.')
	      , root    = namespace.shift()
	      , formParam = root;

	    while(namespace.length) {
	      formParam += '[' + namespace.shift() + ']';
	    }
	    return {
	      param : formParam,
	      msg   : msg,
	      value : value
	    };
	  }
	}));

	// Custom Validators
	app.use(expressValidator({
		customValidators: {
			isArray: function(value) {
				return Array.isArray(value)
			},
			validStrings: function(array, value) {
				var valid = 0;
				
				array.forEach(function(val){
					if (val != null && val.length > 0)
						valid++;
				});

				return valid >= value;
			},
			eachNotEmpty: function(values) {
				return values.every(function(val){
					return val != null && val.length > 0;
				});
			}
		}
	}));
}