var static = require('node-static'),
	http = require('http'),
	util = require('util'),
	url = require('url'),
	fs = require('fs');

var fileServer = new static.Server('./public');
var port = 8080;

var app = http.createServer(function (req, res) {

	var pathname = url.parse(req.url).pathname;
	console.log('pathname: '+pathname);

	req.addListener('end', function () {
		fileServer.serve(req, res);
	});

}).listen(port, function() {
    console.log('Listening at: http://localhost:' + port + '/');
});
