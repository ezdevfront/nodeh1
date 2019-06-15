/*
* homework1.js
* Primary file for homework #1
* Also uses the file config.js
*
* Please create a simple "Hello World" API. Meaning:
* 1. It should be a RESTful JSON API that listens on a port of your choice. //Check!
* 2. When someone sends an HTTP request to the route /hello, you should return a welcome message,
* in JSON format. This message can be anything you want. /Check!
*/

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// The server should respond to all requests with a string or JSON object.
var httpserver = http.createServer(function(req, res){

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    var queryStringObject = parsedUrl.query;

    // get the http Method
    var method = req.method.toLowerCase();



    // Get the headers as an object.
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });


    req.on('end', function(){
        buffer += decoder.end();
        console.log("printing from buffer: \n",buffer);

        //Choose the handler this request should go, if not found use "not found handler"
        var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        choosenHandler(data, function(statusCode,payload){
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the  payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the Payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log('Returning this response: ', statusCode, payloadString);


        });



    });


}); //End of httpserver.

// Start the server, and have it listen on port 3000
httpserver.listen(config.port, function(){
    console.log("The server is listening on port "+config.port+ " in "+ config.envName+" mode");
});

// Define the handlers
var handlers = {};

// GET handlers for homework1.

// Hello handler
handlers.hello = function(data,callback){
    // Callback http status code and a payload object
    callback(220, {'message': 'Welcome! You addressed the path: /Hello',
                    'Oranges' : 'Can be green',
                    'Bananas' : 'With ice cream can be called: splitts',
                    'Fruit' : 'is good for you!'
    });
};
// Bananas handler
handlers.bananas = function(data,callback){
    // Callback http status code and a payload object
    callback(250, {'Go':'Bananas',
                    'Color' : '#F7DC6F',
                    'Taste' : 'Good',
                    'Fruit' : 'true'
    });
};

// Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

// Define a request router
var router = {
    'hello' : handlers.hello,
    'bananas' : handlers.bananas
};
