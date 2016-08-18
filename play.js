var http = require('http');
var fs = require('fs');

var AUDIOFILE = "./audio.ogg";

function serveWithRanges(request, response, content) {
  var range = request.headers.range;
  var total = content.length;
  var parts = range.replace(/bytes=/, "").split("-");
  var partialstart = parts[0];
  var partialend = parts[1];

  var start = parseInt(partialstart, 10);
  var end = partialend ? parseInt(partialend, 10) : total;
  var chunksize = (end-start);
  response.writeHead(206, {
    "Content-Range": "bytes " + start + "-" + end + "/" + total,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "audio/ogg"
  });
  response.end(content.slice(start, end)); 
}

function serveWithoutContentLength(request, response, content) {
  response.writeHead(200, {
    "Content-Type": "audio/ogg"
  });
  response.end(content);
}

function serveWithoutRanges(request, response, content) {
  var total = content.length;
  var start = 0;
  var end = 0;
  var chunksize = 0;
  start = 0;
  end = content.length - 1;
  
  response.writeHead(200, { 
    "Content-Type": "audio/ogg",
    "Content-Length": end
  });

  response.end(content);
}

function serveHTML(request, response, content) {
  response.writeHead(200, 
      {"Content-Type": "text/html"},
      {"Content-Length": content.length}
  );
  response.end(content);
}

function readcontent(file, callback, request, response) {
  var toreturn;
  fs.stat(file, function(err, stats) {
    if (err) { 
      response.writeHead(404);
      response.end("404, not found  " + request.url + ": " + err);
      return toreturn = undefined;
    } 
    fs.readFile(file, function(error, content) {
      if (error) {
        response.writeHead(500);
        response.end("<h1>500, internal error.</h1>");
        return toreturn = undefined;
      }
      else {
        return callback(request, response, content);
      }
    });
  });
}

responses = {
  // normal response
  "/ranges.ogg" : function(request, response) {
    content = readcontent(AUDIOFILE, serveWithRanges, request, response);
  },
  // response without ranges
  "/noranges.ogg" : function(request, response) {
    readcontent(AUDIOFILE, serveWithoutRanges, request, response);
  },
  // response without content length
  "/nocontentlength.ogg" : function(request, response) {
    content = readcontent(AUDIOFILE, serveWithoutContentLength, request, response);
  },
  // demo page serving
  "/sound.html" : function(request, response) {  
    content = readcontent("./sound.html", serveHTML, request, response);
  },
  // empty url
  "/" : function(request, response) {
    readcontent(AUDIOFILE, serveWithoutRanges, request, response);
  }
};

http.createServer(function (request, response) {
  var func = responses[request.url];
  if (func !== undefined) {
    func(request, response);
  }
  else {
    response.writeHead(404);
    response.end("404, not found " + request.url);
  }
}).listen(8125);

console.log('OGG stream at http://0.0.0.0:8125/');
console.log('Test page http://0.0.0.0:8125/sound.html');
