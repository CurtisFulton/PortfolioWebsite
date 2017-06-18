const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

// View engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = require('./routes/poll-api.js');
const pollRouter = require('./routes/poll.js');

// Default portfolio page
app.get('/', function(req, res, next) {
	res.render('home', {
		title : "Poll - Portfolio"
	});
});

app.use('/api', apiRouter);
app.use('/polls', pollRouter);

exports.app = app;