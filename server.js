const express = require('express');
const vhost = require('vhost');

const port = 8080;
const app = express();

app.use(vhost('Www.curtisfulton.me', require('../WebProjects/www').app));
app.use(vhost('Poll.curtisfulton.me', require('../WebProjects/poll').app));
app.use(vhost('NorthForce.curtisfulton.me', require('../WebProjects/northforce').app));

// 500 Error
app.use(function(err, req, res, next) {
	res.status(500).send("500: Internal Server Error");
	console.log(err);
});

// 404 Error
app.use(function(req, res) {
	res.status(404).send("404: Page not found");
});

// Start Server
app.listen(port, function() {
	console.log('Server Online. Port: ' + port);
});
