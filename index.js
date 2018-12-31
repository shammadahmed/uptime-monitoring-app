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

		res.end('Hello World!\n');

		console.log(`Path: ${trimmedPath}; Method: ${method}; Query string object:`, queryStringObject);
		console.table(headers);
		console.log('Payload:', buffer);
	});

});

server.listen(3000, () => console.log('The server is listening on port 3000'))