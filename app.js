var http = require('http');
var fs = require('fs');
var path = require('path');
var db = require('./fake-db');

try {
	var mime = require('mime');
} catch (e) {
	console.log(e.message, '\nPlease install package.json first ($ npm install)');
	process.exit(1);
}

var basePath = process.cwd();
var port = process.argv[2] || 3000;

http.createServer(function(req, res) {
	var filePath = path.join(basePath, req.url);

	function isReqTo(dest) {
		return dest === '/' ? dest === req.url : RegExp('^\/' + dest).test(req.url);
	}
	function readStreamAnd(dbMethod) {
		var response = '';
		req.on('readable', function(chunk) {
			while ((chunk = req.read()) != null) {
				response += chunk;
			}
		});
		req.on('end', function() {
			dbMethod(JSON.parse(response), function(err, model) {
				if (err) {
					res.writeHead(500, {'Content-Type': 'text/html'});
					res.end('<h1>' + http.STATUS_CODES[500] + '</h1><h3>' + err + '</h3>');
				}
				res.end(JSON.stringify(model));
			});
		});
	}
	function handleError(code, message) {
		console.log([
			new Date().toTimeString().slice(0,8),
			http.STATUS_CODES[code],
			message
		].join(' '));
		res.writeHead(code, {'Content-Type': 'text/html'});
		res.end('<h1>' + http.STATUS_CODES[code] + '</h1><h3>' + message + '</h3>');
	}

	if (isReqTo('/')) {
		fs.createReadStream(path.join(basePath, 'views/index.html')).pipe(res);
	} else if (isReqTo('public')) {
		res.writeHead(200, {'Content-Type': mime.lookup(filePath)});
		fs.createReadStream(filePath).pipe(res);
	} else if (isReqTo('api/users\/?$')) {
		res.setHeader('Content-Type', 'application/json');
		switch (req.method) {
			case 'GET':
				db.getCollection(function(err, model) {
					if (err) handleError(500, 'Cannot get data. DB is not implemented.');
					res.end(JSON.stringify(model));
				});
				break;
			case 'POST':
				readStreamAnd(db.create);
				break;
		}
	} else if (isReqTo('api/users')) {
		var id = req.url.replace(/\/api\/users\/(\w{36})\/?/, '$1');
		res.setHeader('Content-Type', 'application/json');
		switch (req.method) {
			case 'GET':
				db.getById(id, function(err, model) {
					if (err) handleError(500, err);
					res.end(JSON.stringify(model));
				});
				break;
			case 'DELETE':
				db.remove(id, function(err) {
					if (err) handleError(500, err);
					res.end();
				});
				break;
			case 'PUT':
				readStreamAnd(db.update)
				break;
		}
	} else {
		handleError(404, req.headers.host + req.url);
	}
}).listen(port);

console.log([
	'Server started at http://localhost:' + port,
	'Running on Node ' + process.version
].join('\n'));