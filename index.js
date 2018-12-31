const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {

	const parsedUrl = url.parse(req.url, true);

	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	const method = req.method.toLowerCase();

	const queryStringObject = parsedUrl.query;

	const headers = req.headers;

	const decoder = new StringDecoder('utf8')
	let buffer = '';

	req.on('data', data => buffer += decoder.write(data));

	req.on('end', () => {
		buffer += decoder.end();

		const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		const data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: buffer
		};

		choosenHandler(data, (statusCode, payload) => {
			statusCode = typeof(statusCode) !== 'undefined' ? statusCode : 200;

			payload = typeof(payload) !== 'undefined' ? payload : {};

			const payloadString = JSON.stringify(payload);

			res.setHeader('Content-Type', 'appliation/json');
			res.statusCode = statusCode;
			res.end(payloadString);
		});


		res.end('Hello World!');
	});

});

server.listen(3000, () => console.log('The server is listening on port 3000'));

const handlers = {};

handlers.sample = function (data, callback) {
	callback(200, {
		name: 'Robo',
		duty: 'stream'
	});
}

handlers.notFound = function (data, callback) {
	callback(400);
}

const router = {
	sample: handlers.sample
}