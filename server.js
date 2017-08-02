const express = require('express');
const vhost = require('vhost');

const port = 80;
const app = express();


//
//app.use(vhost('localhost', require('../Web Projects/vue-portfolio/server.js').app));

app.use(vhost('Www.CurtisFulton.me', require('../WebProjects/vue-portfolio/server.js').app));
app.use(vhost('Poll.CurtisFulton.me', require('../WebProjects/poll/index.js').app));
app.use(require('../WebProjects/vue-portfolio/server.js').app);

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
