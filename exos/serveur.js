// création d'un serveur web
let http = require('http');

let server = http.createServer(function(req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Salut tout le monde !');
});

console.log("serveur lancé")
server.listen(8080);

// -------------------------------------------
